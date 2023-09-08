import moment from "moment-timezone";

import { AccessToken } from "db";

import { ProcessAccessTokenError, ResultWithError, UserAccountDto } from "types/services";
import { AppUserAccountStatus } from "types/db-models";

export const processAccessToken = async (token: string):
  Promise<ResultWithError<UserAccountDto, ProcessAccessTokenError>> => {
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
  if (invalidated || moment(expiry).isBefore(nowMm)) {
    return { errCode: ProcessAccessTokenError.ExpiredToken };
  }

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
