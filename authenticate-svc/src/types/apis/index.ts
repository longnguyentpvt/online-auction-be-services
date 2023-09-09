import { Request } from "express";

export type AccountCredentialAuthenticateRequest = {
  username: string,
  password: string
}

export type AccountCredentialAuthResponse = {
  id: number,
  fullName: string,
  email: string,
  accessToken: string
}

export interface AuthRequest extends Request {
  account: {
    id: number,
    scopes: string[],
    token: string
  }
}
