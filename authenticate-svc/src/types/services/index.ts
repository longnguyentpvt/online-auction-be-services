export interface ResultWithError<T, E> {
  data?: T,
  errCode?: E
}

export type TokenValidatedResult = {
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

export type AccountAuthenticatedResult = {
  id: number,
  fullName: string,
  email: string,
  token: string
}

export enum AccountAuthenticateError {
  InvalidUsernameOrPassword = "InvalidUsernameOrPassword",
  IncorrectPassword = "IncorrectPassword",
  InactiveAccount = "InactiveAccount"
}
