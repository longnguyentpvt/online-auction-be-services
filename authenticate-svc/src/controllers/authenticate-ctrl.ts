import { NextFunction, Request, Response, Router } from "express";
import moment from "moment-timezone";

import { validateRequestScope } from "services/session-scope";
import { processAccessToken } from "services/account";

import { ApiErrorCode, AppController } from "types/app";
import { ProcessAccessTokenError } from "types/services";

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
          statusCode : 400,
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

  initRoute(): Router {
    const router = Router();
    router.post("/health-check", validateRequestScope(["super-admin"]), this.healthCheck);
    router.get("/access", this.authenticateTokenApi);
    return router;
  }

}

export default AuthenticateCtrl;
