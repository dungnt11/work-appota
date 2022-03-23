import { sqlToDB } from './../utils/dbUtil';
import { getStatusOrderBy } from '../utils/helper';
import { ResCustom } from '../types';

export type queryFilter = {
  sortBy: string,
  orderBy: number, // 0: DESC | 1: ASC
  offset: number,
  limit: number,
  name: string,
}

export const getAllProducts = async (query: queryFilter): Promise<ResCustom> => {
    const orderBy = getStatusOrderBy(query.orderBy);
    let singleSql = 'SELECT * FROM PRODUCTS';

    if (!!query.name && query.name.trim()) {
      singleSql += ` WHERE name LIKE '%${query.name}%' OR id = ${query.name}`;
    }

    if (query.sortBy) {
      singleSql += ` ORDER BY ${query.sortBy} ${orderBy}`;
    }

    if (query.limit) {
      singleSql += ` LIMIT ${query.limit}`;
    }

    if (query.offset) {
      singleSql += ` OFFSET ${query.offset}`;
    }

    singleSql += ';';

    const client = await sqlToDB(singleSql);

    if (client) {
      return {
        c: client.rowCount,
        d: client.rows,
      };
    } else {
      throw(404);
    }
};

export const getProduct = async (idProduct: number): Promise<ResCustom> => {
  const singleSql = `SELECT * FROM PRODUCTS WHERE id = ${idProduct};`;

  const client = await sqlToDB(singleSql);

  if (client) {
    return {
      c: client.rowCount,
      d: client.rows,
    };
  } else {
    throw(404);
  }
};
