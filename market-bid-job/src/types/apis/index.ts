import { Method } from "axios";

export type ApiRequest = {
  url: string,
  method: Method,
  params?: Record<string, unknown>,
  data?: Record<string, unknown> | FormData,
  extraHeaders?: Record<string, unknown>,
  adminToken?: boolean,
  timeout?: number,
  download?: boolean
}

export enum ApiErrorCode {
  SYSTEM_ERROR = "SYSTEM_ERROR",
  UNKNOWN = "UNKNOWN",
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_DATA = "INVALID_DATA",
  INACTIVE = "INACTIVE",
  DISABLED_ACCESS = "DISABLED_ACCESS",
  EXISTED = "EXISTED",
  NOT_FOUND = "NOT_FOUND",
  OVER_LIMIT = "OVER_LIMIT",
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE"
}

export type ApiResponse<T> = {
  success: boolean,
  data: T,
  errorCode: ApiErrorCode,
  errorMsg?: string
}

export enum TransactionType {
  Withdrawn = "Withdrawn",
  Deposit = "Deposit",
  TransferIn = "TransferIn",
  Bid = "Bid"
}

export enum TransactionStatus {
  Failed = "Failed",
  Success = "Success"
}

export type BalanceTransactionResponse = {
  id: number,
  type: TransactionType,
  amount: number,
  status: TransactionStatus,
  transactionDateTime : string
}
