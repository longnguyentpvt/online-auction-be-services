import moment from "moment-timezone";

import { UserAccount } from "db";

import { ResultWithError, RetrieveAccountInfoError, UserAccountDto } from "types/services";
import { AppUserAccountStatus } from "types/db-models";

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
