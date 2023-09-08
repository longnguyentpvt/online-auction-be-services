import { Request } from "express";

export interface AuthRequest extends Request {
  account: {
    id: number,
    scopes: string[],
    token: string
  }
}
