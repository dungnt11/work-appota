import { QueryResult } from 'pg';
import {
    commit,
    getTransaction,
    rollback,
    sqlExecMultipleRows,
    sqlExecSingleRow,
    sqlToDB,
} from './../utils/dbUtil';
import { logger } from './../utils/logger';
const transactionSuccess = 'transaction success';

/**
 * sample query
 * @returns { Promise<QueryResult> }
 */
export const getTimeModel = async (): Promise<QueryResult | undefined> => {
    const sql = 'SELECT NOW() as now;';
    try {
        return await sqlToDB(sql);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
    }
};

/**
 * sample query using transactions
 * @returns { Promise<string> } transaction success
 */
export const sampleTransactionModel = async (): Promise<string | undefined> => {
    const singleSql = 'DELETE FROM TEST;';
    const singleData = undefined;
    const multiSql = 'INSERT INTO TEST (testcolumn) VALUES ($1);';
    const multiData: string[][] = [['typescript'], ['is'], ['fun']];
    const client = await getTransaction();
    if (client) {
        try {
            await sqlExecSingleRow(client, singleSql, singleData);
            await sqlExecMultipleRows(client, multiSql, multiData);
            await commit(client);
            return transactionSuccess;
        } catch (error) {
            if (error instanceof Error) {
                await rollback(client);
                logger.error(`sampleTransactionModel error: ${error.message}`);
                throw new Error(error.message);
            }
        }
    }
};
