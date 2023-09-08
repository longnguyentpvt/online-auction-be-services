import { Request } from "express";
import moment from "moment-timezone";

export interface AuthRequest extends Request {
  account: {
    id: number,
    scopes: string[],
    token: string
  }
}

export type AccountRegistrationRequestBody = {
  email: string,
  password: string
  name: string
}

export type AccountDataResponse = {
  id: number,
  fullName: string,
  email: string,
  balance: number,
  lastBidDateTime : moment.Moment
}
