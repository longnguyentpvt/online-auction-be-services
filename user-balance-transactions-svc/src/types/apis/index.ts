import { Request } from "express";
import * as core from "express-serve-static-core";
import moment from "moment-timezone";
import { TransactionStatus, TransactionType } from "types/db-models";

export interface AuthRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
  > extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  account: {
    id: number,
    scopes: string[],
    token: string
  }
}

export type DepositRequestBody = {
  amount: number
}

export type BalanceTransactionResponse = {
  id: number,
  type: TransactionType,
  amount: number,
  status: TransactionStatus,
  transactionDateTime : moment.Moment
}

export type BidReleaseRequestBody = {
  userId: number,
  itemId: number
}
