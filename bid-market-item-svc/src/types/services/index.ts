import moment from "moment-timezone";
import { BidStatus } from "types/db-models";

export interface ResultWithError<T, E> {
  data?: T,
  errCode?: E
}

export type MarketItemDto = {
  id: number,
  ownerId: number,
  name: string,
  startPrice: number,
  currentBidPrice: number,
  createdDateTime : moment.Moment,
  publishedDateTime : moment.Moment,
  endDateTime : moment.Moment
}

export enum NewItemError {
  InvalidUser = "InvalidUser",
  InvalidName = "InvalidName"
}

export enum PublishItemError {
  InvalidUser = "InvalidUser",
  ItemNotFound = "ItemNotFound",
  IncorrectItem = "IncorrectItem",
  ItemPublishedAlready = "ItemPublishedAlready",
  InvalidPrice = "InvalidPrice",
  InvalidDuration = "InvalidDuration"
}

export type ItemBidTransactionDto = {
  id: number,
  bidderId: number,
  itemId: number,
  price: number,
  status: BidStatus,
  createdDateTime : moment.Moment
}

export enum NewBidError {
  InvalidUser = "InvalidUser",
  IncorrectBidTime = "IncorrectBidTime",
  ItemNotFound = "ItemNotFound",
  IncorrectItem = "IncorrectItem",
  ItemDraft = "ItemDraft",
  InvalidPrice = "InvalidPrice",
  InsufficientBalance = "InsufficientBalance"
}
