import { Router } from "express";

export interface AppController {
  initRoute : () => Router
}

export enum ApiErrorCode {
  SYSTEM_ERROR = "SYSTEM_ERROR",
  UNKNOWN = "UNKNOWN",
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_DATA = "INVALID_DATA",
  DISABLED_ACCESS = "DISABLED_ACCESS",
  EXISTED = "EXISTED",
  NOT_FOUND = "NOT_FOUND"
}

export interface ApiError extends Partial<Error> {
  rpCode?: ApiErrorCode,
  rpMessage?: string,
  statusCode?: number
}
