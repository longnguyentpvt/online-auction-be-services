import { Request } from "express";
import * as core from "express-serve-static-core";
import moment from "moment-timezone";

export interface AuthRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
  > extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  account: {
    id: number,
    scopes: string[],
    token: string
  }
}

export interface DefaultListingResponse<T> {
  items: T[],
  count: number
}

export type ItemListingQuery = {
  owner: "me" | undefined,
  page: string,
  noRecords: string,
  filterStatus: "ongoing" | "end" | undefined
}

export type MarketItemResponse = {
  id: number,
  ownerId: number,
  name: string,
  startPrice: number,
  currentBidPrice: number,
  createdDateTime : moment.Moment,
  publishedDateTime : moment.Moment,
  endDateTime : moment.Moment
}
