import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

import {
  ApiErrorCode,
  ApiRequest,
  ApiResponse
} from "types/apis";

import { configuration } from "config";

const {
  mainApiHost,
  superAuthToken
} = configuration;

const apiInstance: AxiosInstance = axios.create({
  baseURL: mainApiHost,
  timeout: 30000
} as CreateAxiosDefaults);

async function apiCall<T>(request: ApiRequest): Promise<ApiResponse<T>> {
  const {
    url,
    method,
    params,
    data,
    extraHeaders,
    adminToken,
    download,
    timeout
  } = request;

  // build header
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders
  };

  let success = false,
    apiResponse = null,
    errorCode = null,
    errorMsg = null;
  if (adminToken) {
    const secret = superAuthToken;
    if (!!secret) {
      headers["Access-Token"] = secret;
    } else {
      errorCode = ApiErrorCode.UNAUTHORIZED;
    }
  }

  if (!errorCode) {
    try {
      const config = {
        url,
        method,
        params,
        data,
        headers
      };
      if (!!timeout) {
        config["timeout"] = timeout;
      }
      if (download) {
        config["responseType"] = "blob";
      }

      const { data: responseData } = await apiInstance.request(config);

      success = true;
      apiResponse = responseData;
    } catch (e) {
      success = false;

      const errorResponse = e.response;
      if (errorResponse) {
        const errorData = errorResponse.data;
        if (errorData) {
          errorCode = errorData.errorCode;
          errorMsg = errorData.errorMessage;
        }
      }

      if (!errorCode) {
        errorCode = ApiErrorCode.UNKNOWN;
        errorMsg = "Wrong API!";
      }
    }
  }

  return {
    success,
    data: apiResponse,
    errorCode,
    errorMsg
  };
}

export default apiCall;
