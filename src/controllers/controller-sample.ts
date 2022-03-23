import { Request, Response } from 'express';
import { logger } from './../utils/logger';
import { getTimeModel, sampleTransactionModel } from './../models/model-sample';

/**
 * sample controller
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const getTime = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getTimeModel();
        if (result) {
            res.status(200).json({
                status: 'ok',
                message: result.rows,
                statusCode: 200,
            });
        }
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`getTime error: ${error.message}`);
            res.status(500).json({
                status: 'error',
                message: error.message,
                statusCode: 500,
            });
        }
    }
};

/**
 * sample controller using transaction
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const sampleTransaction = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const result = await sampleTransactionModel();
        res.status(200).json({
            status: 'ok',
            message: result,
            statusCode: 200,
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`sampleTransaction error: ${error.message}`);
            res.status(500).json({
                status: 'error',
                message: error.message,
                statusCode: 500,
            });
        }
    }
};
