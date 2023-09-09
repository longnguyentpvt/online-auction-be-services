import moment from "moment-timezone";

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
