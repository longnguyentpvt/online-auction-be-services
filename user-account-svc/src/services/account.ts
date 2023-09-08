import moment from "moment-timezone";

import { UserAccount } from "db";

import {
  AccountRegistrationError,
  ResultWithError,
  RetrieveAccountInfoError,
  UserAccountDto
} from "types/services";
import { AppUserAccountStatus } from "types/db-models";

import { validateEmail, validateLength } from "utils/validation";
import { md5Hash } from "utils/encryption";

export const retrieveAccountInfo = async (userId: number):
  Promise<ResultWithError<UserAccountDto, RetrieveAccountInfoError>> => {
  if (!userId) return { errCode: RetrieveAccountInfoError.InvalidId };

  const userAccountEntity = await UserAccount.findByPk(userId);
  if (!userAccountEntity) return { errCode: RetrieveAccountInfoError.NotFound };

  const {
    id,
    fullName,
    email,
    balance,
    lastBidDateTime,
    status: accStatus
  } = userAccountEntity;

  if (accStatus === AppUserAccountStatus.Disabled)
    return { errCode: RetrieveAccountInfoError.InactiveAccount };

  return {
    data: {
      id,
      fullName,
      email,
      balance,
      lastBidDateTime: lastBidDateTime ? moment(lastBidDateTime) : null
    }
  };
};

export const registerUserAccount = async (email: string, password: string, fullName: string):
  Promise<ResultWithError<UserAccountDto, AccountRegistrationError>> => {
  // validate input
  if (!validateEmail(email))
    return { errCode: AccountRegistrationError.InvalidEmail };
  if (!validateLength(password, { max: 25 }))
    return { errCode: AccountRegistrationError.InvalidPassword };
  if (!validateLength(fullName, { max: 255 }))
    return { errCode: AccountRegistrationError.InvalidName };

  // check existing id
  const existAccountEntity = await UserAccount.findOne({ where: { email } });
  if (!!existAccountEntity)
    return { errCode: AccountRegistrationError.EmailExisted };

  // add new account
  const hashPwd = md5Hash(password);
  const id = moment().valueOf();
  const createdAccountEntity = await UserAccount.create({
    id,
    email,
    username: email,
    password: hashPwd,
    balance: 0,
    balanceTransactionMark: 0,
    fullName,
    status: AppUserAccountStatus.Active
  });

  const {
    balance,
    lastBidDateTime
  } = createdAccountEntity;

  return {
    data: {
      id,
      fullName,
      email,
      balance,
      lastBidDateTime: lastBidDateTime ? moment(lastBidDateTime) : null
    }
  };
};
