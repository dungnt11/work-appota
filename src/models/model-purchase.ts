import { logger } from '../utils/logger';
import {
  commit,
  getTransaction,
  rollback,
  sqlExecSingleRow,
  sqlToDB,
} from './../utils/dbUtil';
import { ResCustom } from '../types';

export interface IPurchase {
  idUser: number;
  idProduct: string[];
}

export const purchaseProduct = async (data: IPurchase): Promise<ResCustom | undefined> => {
  const sumMoneyProductsPromise = await sqlToDB(`SELECT SUM(price) FROM products WHERE ID IN(${data.idProduct.toString()})`);
  if (sumMoneyProductsPromise && sumMoneyProductsPromise.rows.length) {
    const sumMoneyProducts = Number(sumMoneyProductsPromise.rows[0].sum);
    const client = await getTransaction();
    const sqlInsertPurchase = 'INSERT INTO PRODUCTS_TRANSACTION(id_user, id_product, price, status) VALUES ($1, $2, $3, $4);';
    const dataInsert = [
      data.idUser,
      data.idProduct,
      sumMoneyProducts,
      1,
    ];
    if (client) {
        try {
            await sqlExecSingleRow(client, sqlInsertPurchase, dataInsert);
            await commit(client);
            return {
              c: 1,
              d: true,
            };
        } catch (error) {
            if (error instanceof Error) {
                await rollback(client);
                logger.error(`purchaseProduct error: ${error.message}`);
                throw new Error(error.message);
            }
        }
    }
  }
};
