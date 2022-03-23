import { Request, Response } from 'express';
import { logger } from './../utils/logger';
import { purchaseProduct, IPurchase } from '../models/model-purchase';

export const purchaseProductsTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as IPurchase;
    const result = await purchaseProduct(body);
    res.status(200).json(result);
  } catch (error) {
      if (error instanceof Error) {
          logger.error(`allProducts error: ${error.message}`);
          res.status(500).json({
              status: 'error',
              message: error.message,
              statusCode: 500,
          });
      }
  }
};