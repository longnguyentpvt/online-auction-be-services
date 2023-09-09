import moment from "moment-timezone";

import {
  AccountTransaction,
  InferAttributes,
  literal,
  MarketItem,
  MarketItemBid,
  MarketItemBidder,
  Op,
  transaction,
  Transaction,
  UserAccount,
  WhereOptions
} from "db";

import {
  ItemBidTransactionDto,
  MarketItemDto,
  NewBidError,
  NewItemError,
  PublishItemError,
  ResultWithError
} from "types/services";
import { BidStatus, TransactionStatus, TransactionType } from "types/db-models";

import { validateLength } from "utils/validation";

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

  const itemDtos: MarketItemDto[] = rows.map((row: MarketItem) => {
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

export const newItem = async (userId: number, name: string):
  Promise<ResultWithError<MarketItemDto, NewItemError>> => {
  if (!userId) return { errCode: NewItemError.InvalidUser };

  const invalidNameLength = validateLength(name, { max: 255 });
  if (!invalidNameLength) return { errCode: NewItemError.InvalidName };

  const newItemEntity = await MarketItem.create({
    ownerId: userId,
    name,
    startPrice: 0,
    currentBidPrice: 0,
    bidProcessMark: 0
  });

  const {
    id,
    ownerId,
    startPrice,
    currentBidPrice,
    endDateTime,
    publishedDateTime,
    createdDateTime
  } = newItemEntity;

  return {
    data: {
      id,
      ownerId,
      name,
      startPrice,
      currentBidPrice,
      createdDateTime: moment(createdDateTime),
      endDateTime: moment(endDateTime),
      publishedDateTime: moment(publishedDateTime)
    }
  };
};

export const publishItem = async (
  userId: number,
  itemId: number,
  startPrice: number,
  durationHours: number
):
  Promise<ResultWithError<MarketItemDto, PublishItemError>> => {
  const nowMm = moment();

  if (!userId) return { errCode: PublishItemError.InvalidUser };

  const foundItem = await MarketItem.findByPk(itemId);
  if (!foundItem) return { errCode: PublishItemError.ItemNotFound };

  const {
    ownerId: itemOwnerId,
    publishedDateTime
  } = foundItem;

  if (itemOwnerId !== userId) return { errCode: PublishItemError.IncorrectItem };
  if (!!publishedDateTime) return { errCode: PublishItemError.ItemPublishedAlready };

  startPrice = !startPrice ? 0 : Math.round(startPrice);
  if (isNaN(startPrice) || startPrice <= 0)
    return { errCode: PublishItemError.InvalidPrice };

  durationHours = !durationHours ? 0 : Math.round(durationHours);
  if (isNaN(durationHours) || durationHours <= 0)
    return { errCode: PublishItemError.InvalidDuration };

  const endDateTime = moment(nowMm).add(durationHours, "hour");
  foundItem.publishedDateTime = nowMm.toDate();
  foundItem.endDateTime = endDateTime.toDate();
  foundItem.startPrice = startPrice;
  await foundItem.save();

  const {
    id,
    name,
    ownerId,
    startPrice: itemStartPrice,
    currentBidPrice,
    createdDateTime,
    publishedDateTime: itemPublishedDateTime,
    endDateTime: itemEndDateTime
  } = foundItem;

  return {
    data: {
      id,
      ownerId,
      name,
      startPrice: itemStartPrice,
      currentBidPrice,
      createdDateTime: moment(createdDateTime),
      endDateTime: moment(itemEndDateTime),
      publishedDateTime: moment(itemPublishedDateTime)
    }
  };
};

export const newBidOnItem = async (
  userId: number,
  itemId: number,
  newPrice: number
):
  Promise<ResultWithError<ItemBidTransactionDto, NewBidError>> => {
  const nowMm = moment();
  if (!userId) return { errCode: NewBidError.InvalidUser };
  const {
    balance: currentBalance,
    balanceTransactionMark,
    lastBidDateTime
  } = await UserAccount.findByPk(userId);
  const validBidTime = !lastBidDateTime ||
    moment(lastBidDateTime).isBefore(moment(nowMm).subtract(5, "second"));
  if (!validBidTime) return { errCode: NewBidError.IncorrectBidTime };

  const foundItem = await MarketItem.findByPk(itemId);
  if (!foundItem) return { errCode: NewBidError.ItemNotFound };

  const {
    ownerId: itemOwnerId,
    publishedDateTime,
    currentBidPrice,
    bidProcessMark
  } = foundItem;

  if (itemOwnerId === userId) return { errCode: NewBidError.IncorrectItem };
  if (!publishedDateTime) return { errCode: NewBidError.ItemDraft };

  newPrice = !newPrice ? 0 : Math.round(newPrice);
  if (isNaN(newPrice) || newPrice <= currentBidPrice)
    return { errCode: NewBidError.InvalidPrice };

  const existingBidder = await MarketItemBidder.findOne({
    where: {
      itemId,
      bidderId: userId
    }
  });
  const holdBalance = existingBidder?.amount ?? 0;
  const realBidAmount = newPrice - holdBalance;
  const newBalance = currentBalance - realBidAmount;
  if (newBalance < 0)
    return { errCode: NewBidError.InsufficientBalance };

  const bidTransaction = await transaction(async (transaction: Transaction) => {
    const [affectedCount] = await UserAccount.update({
      balance: newBalance,
      lastBidDateTime: nowMm.toDate(),
      balanceTransactionMark: literal("balance_transaction_mark + 1")
    }, {
      where: {
        id: userId,
        balanceTransactionMark
      },
      transaction
    });
    const transactionStatus = affectedCount > 0 ?
      TransactionStatus.Success : TransactionStatus.Failed;
    await AccountTransaction.create({
      userId,
      type: TransactionType.Bid,
      amount: realBidAmount,
      status: transactionStatus
    }, {
      transaction
    });

    let bidStatus = BidStatus.Failed;
    if (TransactionStatus.Success === transactionStatus) {
      const [affectedCount] = await MarketItem.update({
        currentBidPrice: newPrice,
        bidProcessMark: literal("bid_process_mark + 1")
      }, {
        where: {
          id: itemId,
          bidProcessMark
        },
        transaction
      });

      bidStatus = affectedCount > 0 ? BidStatus.Success : BidStatus.Failed;
    }

    const itemBid = await MarketItemBid.create({
      itemId,
      bidderId: userId,
      price: newPrice,
      status: bidStatus
    }, { transaction });

    await MarketItemBidder.create({
      itemId,
      bidderId: userId,
      amount: newPrice
    }, { transaction });

    return itemBid;
  });

  const {
    id,
    bidderId,
    itemId: bidItemId,
    createdDateTime,
    status: bidStatus,
    price: bidPrice
  } = bidTransaction;

  return {
    data: {
      id,
      bidderId,
      itemId: bidItemId,
      price: bidPrice,
      status: bidStatus,
      createdDateTime: moment(createdDateTime)
    }
  };
};

