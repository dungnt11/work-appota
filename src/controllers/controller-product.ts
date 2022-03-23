import { Request, Response } from 'express';
import { logger } from './../utils/logger';
import { getAllProducts, getProduct, queryFilter } from '../models/model-product';

export const allProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query as unknown as queryFilter;
      const result = await getAllProducts(query);
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

export const detailProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
      const idProduct = req.params.idProduct;
      if (!idProduct) {
            res.status(404).json({
                status: 'error',
                message: 'Not found',
                statusCode: 404,
            });
      } else {
          const result = await getProduct(Number(idProduct));
          res.status(200).json(result);
      }
  } catch (error) {
      if (error instanceof Error) {
          logger.error(`Detail product error: ${error.message}`);
          res.status(500).json({
              status: 'error',
              message: error.message,
              statusCode: 500,
          });
      }
  }
};
