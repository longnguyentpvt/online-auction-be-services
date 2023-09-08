import moment from "moment-timezone";

export interface ResultWithError<T, E> {
  data?: T,
  errCode?: E
}

export type UserAccountDto = {
  id: number,
  fullName: string,
  email: string,
  permissionScopes : string[]
}

export enum ProcessAccessTokenError {
  InvalidToken = "InvalidToken",
  ExpiredToken = "ExpiredToken",
  InactiveAccount = "InactiveAccount"
}
