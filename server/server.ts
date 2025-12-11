import express from 'express';
import path from 'path';
import { sequelize } from './models/index';
import { exec } from 'child_process';
import util from 'util';
import authRoutes from './routes/authRoutes';
import workflowRoutes from './routes/workflowRoutes';
import shareRoutes from './routes/shareRoutes';
import { requireAuth } from './middleware/auth';
import logger from './logger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/auth/callback', (_, res) => {
  const filePath = path.resolve(__dirname, '../../public/dist/index.html');
  res.sendFile(filePath);
});

app.use('/auth', authRoutes);
app.use('/api/workflows', requireAuth, workflowRoutes);
app.use('/api/shares', requireAuth, shareRoutes);

app.get('/db-health', async (_req, res) => {
  const start = Date.now();
  try {
    await sequelize.authenticate();
    res.json({ ok: true, duration: Date.now() - start });
  } catch (err) {
    logger.error(err, 'DB health failed');
    res.status(500).json({ ok: false, error: JSON.stringify(err) });
  }
});

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.resolve(__dirname, '../../public/dist');
  app.use(express.static(buildPath));
  app.get('*', (_, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const execPromise = util.promisify(exec);
const runMigrations = async (): Promise<void> => {
  try {
    const { stdout } = await execPromise('pnpm run migrate');
    console.log(`Migration output: ${stdout}`);
  } catch (error) {
    console.error(`Error running migrations: ${(error as Error).message}`);
    throw error;
  }
};

(async () => {
  try {
    await runMigrations();
    await sequelize.authenticate();
    console.log('Database connected.');
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });

    server.requestTimeout = 60_000;

    logger.info(
      {
        nodeEnv: process.env.NODE_ENV,
        dbHost: new URL(process.env.DB_CONNECTION_STRING!).hostname,
        dbPort: new URL(process.env.DB_CONNECTION_STRING!).port,
        pool: (sequelize as any).options.pool,
      },
      'DB config at startup'
    );

    // Monitor DB Connection Pool
    setInterval(() => {
      try {
        const pool = (sequelize.connectionManager as any).pool;
        if (pool) {
          logger.info(
            {
              total: pool.size,
              idle: pool.available,
              active: pool.using,
              waiting: pool.waiting,
            },
            'DB Connection Pool Stats'
          );
        }
      } catch (err) {
        logger.error(err, 'Error fetching DB pool stats');
      }
    }, 5_000);
  } catch (error) {
    logger.error(error, 'Unable to connect to the database');
  }
})();
