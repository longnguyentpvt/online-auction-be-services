import moment from "moment-timezone";

export interface ResultWithError<T, E> {
  data?: T,
  errCode?: E
}

export type UserAccountDto = {
  id: number,
  fullName: string,
  email: string,
  balance: number,
  lastBidDateTime : moment.Moment
}

export enum RetrieveAccountInfoError {
  InvalidId = "InvalidId",
  InactiveAccount = "InactiveAccount",
  NotFound = "NotFound"
}

export enum AccountRegistrationError {
  InvalidName = "InvalidName",
  InvalidEmail = "InvalidEmail",
  InvalidPassword = "InvalidPassword",
  EmailExisted = "EmailExisted"
}
