import moment from "moment-timezone";

import { AccessToken, UserAccount } from "db";

import { md5Hash } from "utils/encryption";

import {
  AccountAuthenticatedResult,
  AccountAuthenticateError,
  ProcessAccessTokenError,
  ResultWithError,
  TokenValidatedResult
} from "types/services";
import { AppUserAccountStatus } from "types/db-models";

export const processAccessToken = async (token: string):
  Promise<ResultWithError<TokenValidatedResult, ProcessAccessTokenError>> => {
  const nowMm = moment();
  if (!token) return { errCode: ProcessAccessTokenError.InvalidToken };

  const accessTokenEntity = await AccessToken.findByPk(token, {
    include: {
      association: AccessToken.associations.user,
      required: true
    }
  });

  const {
    invalidated,
    expiry,
    user
  } = accessTokenEntity ?? {};
  if (invalidated || moment(expiry).isBefore(nowMm))
    return { errCode: ProcessAccessTokenError.ExpiredToken };

  const {
    id,
    fullName,
    email,
    status: accStatus,
    permissionScopes
  } = user;

  if (accStatus === AppUserAccountStatus.Disabled)
    return { errCode: ProcessAccessTokenError.InactiveAccount };

  return {
    data: {
      id,
      fullName,
      email,
      permissionScopes
    }
  };
};

export const authenticateUserAccount = async (username: string, password: string):
  Promise<ResultWithError<AccountAuthenticatedResult, AccountAuthenticateError>> => {
  const nowMm = moment();
  if (!username || !password)
    return { errCode: AccountAuthenticateError.InvalidUsernameOrPassword };

  const uAccountEntity = await UserAccount.findOne({
    where: { username }
  });
  const {
    id,
    password: accPassword,
    email,
    fullName,
    status
  } = uAccountEntity ?? {};

  if (md5Hash(password) !== accPassword)
    return { errCode: AccountAuthenticateError.IncorrectPassword };

  if (status === AppUserAccountStatus.Disabled)
    return { errCode: AccountAuthenticateError.InactiveAccount };

  const randomToken = `online-auction-${ moment().toISOString() }`;
  const accessToken = md5Hash(randomToken);
  const expiry = moment(nowMm).add(7, "days");

  await AccessToken.create({
    token: accessToken,
    userId: id,
    invalidated: 0,
    expiry: expiry.toDate()
  });

  return {
    data : {
      id,
      email,
      fullName,
      token: accessToken
    }
  };
};

export const invalidateAuthToken = async(token: string) : Promise<void> => {
  const tokenEntity = await AccessToken.findByPk(token);
  tokenEntity.invalidated = 1;
  await tokenEntity.save();
};
