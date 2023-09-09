import { NextFunction, Request, Response, Router } from "express";
import moment from "moment-timezone";

import { validateRequestScope } from "services/session-scope";
import {
  processAccessToken,
  authenticateUserAccount, invalidateAuthToken
} from "services/account";

import { ApiErrorCode, AppController } from "types/app";
import { ProcessAccessTokenError, AccountAuthenticateError } from "types/services";
import { AccountCredentialAuthenticateRequest, AccountCredentialAuthResponse, AuthRequest } from "types/apis";

class AuthenticateCtrl implements AppController {

  constructor() {
  }

  healthCheck = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        path,
        query,
        body
      } = req;
      const mm = moment();

      res.status(200).send({
        path,
        query,
        body,
        time: mm
      });
    } catch (e) {
      next(e);
    }
  };

  authenticateTokenApi = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const accessToken = req.header("Access-Token");

      const {
        errCode,
        data
      } = await processAccessToken(accessToken);
      // console.log("accessToken", accessToken, errCode, data);

      if (errCode) {
        let rpCode = ApiErrorCode.UNKNOWN,
          rpMessage = "";
        switch (errCode) {
          case ProcessAccessTokenError.InvalidToken:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "Token is invalid data!";
            break;
          case ProcessAccessTokenError.ExpiredToken:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "Token is expired!";
            break;
          case ProcessAccessTokenError.InactiveAccount:
            rpCode = ApiErrorCode.DISABLED_ACCESS;
            rpMessage = "Account is disabled!";
            break;
        }

        throw {
          statusCode: 400,
          rpCode,
          rpMessage
        };
      }

      const {
        id,
        permissionScopes
      } = data;

      res.setHeader("X-Account-Id", id);
      res.setHeader("X-Account-Scopes", (permissionScopes ?? []).concat(","));
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  };

  authenticateCredentialApi = async (
    req: Request<unknown, unknown, AccountCredentialAuthenticateRequest>,
    res: Response<AccountCredentialAuthResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        username,
        password
      } = req.body;

      const {
        errCode,
        data
      } = await authenticateUserAccount(username, password);

      if (errCode) {
        let rpCode = ApiErrorCode.UNKNOWN,
          rpMessage = "";
        switch (errCode) {
          case AccountAuthenticateError.InvalidUsernameOrPassword:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "Request data is invalid!";
            break;
          case AccountAuthenticateError.IncorrectPassword:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "Token is expired!";
            break;
          case AccountAuthenticateError.InactiveAccount:
            rpCode = ApiErrorCode.DISABLED_ACCESS;
            rpMessage = "Account is disabled!";
            break;
        }

        throw {
          statusCode: 400,
          rpCode,
          rpMessage
        };
      }

      const {
        id,
        fullName,
        email
      } = data;

      res.status(200).send({
        id,
        fullName,
        email
      });
    } catch (e) {
      next(e);
    }
  };

  invalidateAccessTokenApi = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token } = req.account;

      await invalidateAuthToken(token);

      res.status(200).send({ success: true });
    } catch (e) {
      next(e);
    }
  };

  initRoute(): Router {
    const router = Router();
    router.post("/health-check", validateRequestScope(["super-admin"]), this.healthCheck);
    router.post("/access", this.authenticateTokenApi);
    router.post("/account", this.authenticateCredentialApi);
    router.post("/invalidate", this.invalidateAccessTokenApi);
    return router;
  }

}

export default AuthenticateCtrl;
