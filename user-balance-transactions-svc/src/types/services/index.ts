import moment from "moment-timezone";
import { TransactionStatus, TransactionType } from "types/db-models";

export interface ResultWithError<T, E> {
  data?: T,
  errCode?: E
}

export type AccountTransactionDto = {
  id: number,
  type: TransactionType,
  amount: number,
  status: TransactionStatus,
  transactionDateTime : moment.Moment
}

export enum DepositError {
  InvalidUser = "InvalidUser",
  InvalidAmount = "InvalidAmount"
}
