import { Request } from "express";
import moment from "moment-timezone";

export type AccountCredentialAuthenticateRequest = {
  username: string,
  password: string
}

export type AccountCredentialAuthResponse = {
  id: number,
  fullName: string,
  email: string,
  accessToken: string,
  tokenExpiry: moment.Moment
}

export interface AuthRequest extends Request {
  account: {
    id: number,
    scopes: string[],
    token: string
  }
}
