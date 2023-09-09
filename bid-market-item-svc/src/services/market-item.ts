import moment from "moment-timezone";

import {
  MarketItem,
  WhereOptions,
  Op
} from "db";

import { ResultWithError, MarketItemDto } from "types/services";
import { InferAttributes } from "sequelize";

export const retrieveMarketItems = async (
  ownerId: number | null,
  filterStatus: "ongoing" | "end" | null,
  orderBy: "created" | "published",
  page: number,
  noRecords: number
): Promise<ResultWithError<{
  items: MarketItemDto[],
  count: number
}, undefined>> => {
  const nowMm = moment();

  // building where statement
  const whereStatement: WhereOptions<InferAttributes<MarketItem>> = {};

  if (!!ownerId) whereStatement.ownerId = ownerId;
  if (!!filterStatus) {
    whereStatement.endDateTime = {
      [("ongoing" === filterStatus) ? Op.gt : Op.lte]: nowMm.toDate()
    };
  }

  const offset = (page - 1) * noRecords;
  const {
    count,
    rows
  } = await MarketItem.findAndCountAll({
    where: whereStatement,
    order: [
      [
        "created" === orderBy ? "createdDateTime" : "publishedDateTime",
        "DESC"
      ]
    ],
    offset,
    limit: noRecords
  });

  const itemDtos: MarketItemDto[] = rows.map((row : MarketItem) => {
    const {
      id,
      ownerId,
      name,
      startPrice,
      currentBidPrice,
      endDateTime,
      publishedDateTime,
      createdDateTime
    } = row;

    return {
      id,
      ownerId,
      name,
      startPrice,
      currentBidPrice,
      createdDateTime: moment(createdDateTime),
      endDateTime: moment(endDateTime),
      publishedDateTime: moment(publishedDateTime)
    };
  });

  return {
    data: {
      count,
      items: itemDtos
    }
  };
};


