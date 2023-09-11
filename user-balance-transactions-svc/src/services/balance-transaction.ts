import moment from "moment-timezone";

import { AccountTransaction, literal, Transaction, transaction, UserAccount } from "db";

import { AccountTransactionDto, DepositError, ResultWithError } from "types/services";
import { ItemBidderReleaseStatus, TransactionStatus, TransactionType } from "types/db-models";
import { MarketItemBidder } from "db/models/MarketItemBidder";

export const depositToBalance = async (userId: number, amount: number):
  Promise<ResultWithError<AccountTransactionDto, DepositError>> => {
  if (!userId) return { errCode: DepositError.InvalidUser };

  amount = !amount ? 0 : Math.round(amount);

  if (isNaN(amount) || amount <= 0)
    return { errCode: DepositError.InvalidAmount };

  const userAccountEntity = await UserAccount.findByPk(userId);
  if (!userAccountEntity) return { errCode: DepositError.InvalidUser };

  const {
    balance: currentBalance,
    balanceTransactionMark
  } = userAccountEntity;
  const newBalance = currentBalance + amount;

  const transactionEntity = await transaction(async (transaction: Transaction) => {
    const [affectedCount] = await UserAccount.update({
      balance: newBalance,
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
    return await AccountTransaction.create({
      userId,
      type: TransactionType.Deposit,
      amount,
      status: transactionStatus
    }, {
      transaction
    });
  });

  const {
    id,
    amount: transactionAmount,
    createdDateTime,
    status,
    type: transactionType
  } = transactionEntity;

  return {
    data: {
      id,
      amount: transactionAmount,
      status,
      type: transactionType,
      transactionDateTime: createdDateTime ? moment(createdDateTime) : null
    }
  };
};

export const releaseBidToBalance = async (userId: number, itemId: number):
  Promise<ResultWithError<AccountTransactionDto, DepositError>> => {
  if (!userId) return { errCode: DepositError.InvalidUser };

  const foundBidder = await MarketItemBidder.findOne({
    where: {
      bidderId: userId,
      itemId
    }
  });
  if (!foundBidder) return { errCode: DepositError.InvalidUser };

  const userAccountEntity = await UserAccount.findByPk(userId);
  const {
    amount
  } = foundBidder;
  const {
    balance: currentBalance,
    balanceTransactionMark
  } = userAccountEntity;
  const newBalance = currentBalance + amount;

  const transactionEntity = await transaction(async (transaction: Transaction) => {
    const [affectedCount] = await UserAccount.update({
      balance: newBalance,
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
    const balanceTransaction = await AccountTransaction.create({
      userId,
      type: TransactionType.TransferIn,
      amount,
      status: transactionStatus
    }, {
      transaction
    });

    const releaseStatus = transactionStatus !== TransactionStatus.Failed ?
      ItemBidderReleaseStatus.Success :
      ItemBidderReleaseStatus.Failed;
    await MarketItemBidder.update({
      releaseStatus
    }, {
      where: {
        itemId,
        bidderId: userId
      },
      transaction
    });

    return balanceTransaction;
  });

  const {
    id,
    amount: transactionAmount,
    createdDateTime,
    status,
    type: transactionType
  } = transactionEntity;

  return {
    data: {
      id,
      amount: transactionAmount,
      status,
      type: transactionType,
      transactionDateTime: createdDateTime ? moment(createdDateTime) : null
    }
  };
};
