import express from 'express';
import path from 'path';
import { sequelize } from './models/index';
import { exec } from 'child_process';
import util from 'util';
import authRoutes from './routes/authRoutes';
import workflowRoutes from './routes/workflowRoutes';
import shareRoutes from './routes/shareRoutes';
import { requireAuth } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/auth/callback', (_, res) => {
  const filePath = path.resolve(__dirname, '../../public/dist/index.html');
  res.sendFile(filePath);
});

app.use('/auth', requireAuth, authRoutes);
app.use('/api/workflows', requireAuth, workflowRoutes);
app.use('/api/shares', requireAuth, shareRoutes);

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
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
