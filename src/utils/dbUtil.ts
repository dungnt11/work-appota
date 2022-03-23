import { Pool, PoolClient, QueryResult } from 'pg';
import { config } from './../config';
import { logger } from './../utils/logger';
import { PgConfig } from '../types';

const pgconfig: PgConfig = {
    user: config.db.user,
    database: config.db.database,
    password: config.db.password,
    host: config.db.host,
    port: config.db.port,
    max: config.db.max,
    idleTimeoutMillis: config.db.idleTimeoutMillis,
};

const pool = new Pool(pgconfig);

logger.info(`DB Connection Settings: ${JSON.stringify(pgconfig)}`);

pool.on('error', function (err: Error) {
    logger.error(`idle client error, ${err.message} | ${err.stack}`);
});

export const sqlToDB = async (
    sql: string,
    data: string[][] | undefined = undefined
): Promise<QueryResult | undefined> => {
    logger.debug(`sqlExecSingleRow() sql: ${sql} | data: ${data}`);
    let result: QueryResult;
    try {
        result = await pool.query(sql, data);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
};

export const getTransaction = async (): Promise<PoolClient | undefined> => {
    logger.debug(`getTransaction()`);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        return client;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
};

export const sqlExecSingleRow = async (
    client: PoolClient,
    sql: string,
    data: any = undefined
): Promise<QueryResult | undefined> => {
    logger.debug(`sqlExecSingleRow() sql: ${sql} | data: ${data}`);
    try {
        const result: QueryResult = await client.query(sql, data);
        logger.debug(
            `sqlExecSingleRow(): ${result.command} | ${result.rowCount}`
        );
        return result;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(
                `sqlExecSingleRow() error: ${error.message} | sql: ${sql} | data: ${data}`
            );
            throw new Error(error.message);
        }
    }
};

export const sqlExecMultipleRows = async (
    client: PoolClient,
    sql: string,
    data: string[][]
): Promise<void> => {
    logger.debug(`inside sqlExecMultipleRows()`);
    logger.debug(`sqlExecMultipleRows() data: ${data}`);
    if (data.length !== 0) {
        for (const item of data) {
            try {
                logger.debug(`sqlExecMultipleRows() item: ${item}`);
                logger.debug(`sqlExecMultipleRows() sql: ${sql}`);
                await client.query(sql, item);
            } catch (error) {
                if (error instanceof Error) {
                    logger.error(`sqlExecMultipleRows() error: ${error}`);
                    throw new Error(error.message);
                }
            }
        }
    } else {
        logger.error(`sqlExecMultipleRows(): No data available`);
        throw new Error('sqlExecMultipleRows(): No data available');
    }
};

export const rollback = async (client: PoolClient): Promise<void> => {
    if (typeof client !== 'undefined' && client) {
        try {
            logger.info(`sql transaction rollback`);
            await client.query('ROLLBACK');
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        } finally {
            client.release();
        }
    } else {
        logger.warn(`rollback() not excuted. client is not set`);
    }
};

export const commit = async (client: PoolClient): Promise<void> => {
    logger.debug(`sql transaction committed`);
    try {
        await client.query('COMMIT');
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    } finally {
        client.release();
    }
};
