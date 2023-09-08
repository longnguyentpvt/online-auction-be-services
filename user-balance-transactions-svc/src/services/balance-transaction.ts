import moment from "moment-timezone";

import {
  literal,
  transaction,
  Transaction,
  UserAccount,
  AccountTransaction
} from "db";

import { DepositError, ResultWithError, AccountTransactionDto } from "types/services";
import { TransactionStatus, TransactionType } from "types/db-models";

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
