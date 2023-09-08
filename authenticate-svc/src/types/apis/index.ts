import { Request } from "express";

export type AccountCredentialAuthenticateRequest = {
  username: string,
  password: string
}

export interface AuthRequest extends Request {
  account: {
    id: number,
    scopes: string[],
    token: string
  }
}
