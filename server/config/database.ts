import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  isProduction
    ? (process.env.DB_CONNECTION_STRING as string)
    : `postgres://postgres:password@localhost:5432/gruntless_dev`,
  {
    logging: false,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  }
);

console.log('[DB_CONFIG] Pool settings:', sequelize.config.pool);

export default sequelize;
