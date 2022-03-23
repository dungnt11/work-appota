import dotenv from 'dotenv';
//DO NOT COMMIT YOUR .env FILE
dotenv.config({ path: '.env' });
import { Config } from './types';

export const config: Config = {
    serviceName: process.env.SERVICENAME || 'node typescript postgres app',
    port: Number(process.env.PORT) || 3000,
    loggerLevel: 'debug',
    db: {
        user: process.env.POSTGRES_USER || '',
        password: process.env.POSTGRES_PASSWORD || '',
        database: process.env.POSTGRES_DB || '',
        host: process.env.POSTGRES_HOST || '',
        port: Number(process.env.POSTGRES_PORT),
        max: Number(process.env.DB_MAX_CLIENTS) || 20,
        idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
    },
};
