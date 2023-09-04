import { Transaction } from "sequelize";
import sequelize from "./seq";

type TransactionCallback<T> = (t : Transaction) => PromiseLike<T>;

export const config = async () : Promise<void> => {
  try {
    await sequelize.authenticate();
    console.info("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", { error });
  }
};

export async function transaction<T>(callback : TransactionCallback<T>) : Promise<T> {
  return await sequelize.transaction(callback);
}
