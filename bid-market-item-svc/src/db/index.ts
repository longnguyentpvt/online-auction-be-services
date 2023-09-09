import {
  Transaction,
  Sequelize,
  literal,
  WhereOptions,
  InferAttributes,
  Op
} from "sequelize";
import sequelize from "./seq";
import "./associations";

type TransactionCallback<T> = (t: Transaction) => PromiseLike<T>;

export const config = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.info("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", { error });
  }
};

export async function transaction<T>(callback: TransactionCallback<T>): Promise<T> {
  return await sequelize.transaction(callback);
}

export * from "./models/UserAccount";
export * from "./models/MarketItem";

export const getSequelize = (): Sequelize => {
  return sequelize;
};

export {
  literal,
  Transaction,
  WhereOptions,
  InferAttributes,
  Op
};
