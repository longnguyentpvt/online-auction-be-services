import { Router } from "express";

export interface AppController {
  initRoute : () => Router
}

export enum ApiErrorCode {
  SYSTEM_ERROR = "SYSTEM_ERROR",
  UNKNOWN = "UNKNOWN",
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_DATA = "INVALID_DATA",
  EXISTED = "EXISTED",
  NOT_FOUND = "NOT_FOUND",
  INACTIVE = "INACTIVE",
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  OVER_LIMIT = "OVER_LIMIT"
}

export interface ApiError extends Partial<Error> {
  rpCode?: ApiErrorCode,
  rpMessage?: string,
  statusCode?: number
}
