import apiCall from "./utils";

import {
  ApiRequest,
  ApiResponse,
  BalanceTransactionResponse
} from "types/apis";

export const releaseBidApi = async (userId: number, itemId: number):
  Promise<ApiResponse<BalanceTransactionResponse>> => {
  try {
    const requestBody = {
      userId,
      itemId
    };

    const request: ApiRequest = {
      url: "/account/balance/bid/release",
      method: "POST",
      data: requestBody,
      adminToken: true
    };
    return await apiCall<BalanceTransactionResponse>(request);
  } catch (e) {
    console.error(e);
  }
};
