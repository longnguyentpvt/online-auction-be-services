import { NextFunction, Request, Response, Router } from "express";
import moment from "moment-timezone";

import { validateRequestScope } from "services/session-scope";
import { registerUserAccount, retrieveAccountInfo } from "services/account";

import { ApiErrorCode, AppController } from "types/app";
import { AccountRegistrationError, RetrieveAccountInfoError } from "types/services";
import { AccountDataResponse, AccountRegistrationRequestBody, AuthRequest } from "types/apis";

class UserAccountCtrl implements AppController {

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

  getInfoApi = async (
    req: AuthRequest,
    res: Response<AccountDataResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const rqAccountId = req.account.id;

      const {
        errCode,
        data
      } = await retrieveAccountInfo(rqAccountId);

      if (errCode) {
        let statusCode = 400,
          rpCode = ApiErrorCode.UNKNOWN,
          rpMessage = "";
        switch (errCode) {
          case RetrieveAccountInfoError.InactiveAccount:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "Account is disabled!";
            break;
          case RetrieveAccountInfoError.NotFound:
            statusCode = 404;
            rpCode = ApiErrorCode.NOT_FOUND;
            rpMessage = "Account does not exist!";
            break;
          case RetrieveAccountInfoError.InvalidId:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "Id is missing!";
            break;
        }

        throw {
          statusCode,
          rpCode,
          rpMessage
        };
      }

      const {
        id,
        fullName,
        email,
        balance,
        lastBidDateTime
      } = data;
      res.status(200).send({
        id,
        fullName,
        email,
        balance,
        lastBidDateTime
      });
    } catch (e) {
      next(e);
    }
  };

  registerApi = async (
    req: Request<unknown, unknown, AccountRegistrationRequestBody>,
    res: Response<AccountDataResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        email,
        password,
        name
      } = req.body;

      const {
        errCode,
        data
      } = await registerUserAccount(email, password, name);
      // console.log("error", errCode, { email, password, name });

      if (errCode) {
        let rpCode = ApiErrorCode.UNKNOWN,
          rpMessage = "";
        switch (errCode) {
          case AccountRegistrationError.InvalidName:
          case AccountRegistrationError.InvalidPassword:
          case AccountRegistrationError.InvalidEmail:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "Request data is invalid!";
            break;
          case AccountRegistrationError.EmailExisted:
            rpCode = ApiErrorCode.EXISTED;
            rpMessage = "Email existed!";
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
        email: rpEmail,
        balance,
        lastBidDateTime
      } = data;
      res.status(200).send({
        id,
        fullName,
        email: rpEmail,
        balance,
        lastBidDateTime
      });
    } catch (e) {
      next(e);
    }
  };

  initRoute(): Router {
    const router = Router();
    router.post("/health-check", validateRequestScope(["super-admin"]), this.healthCheck);
    router.post("/register", this.registerApi);
    router.get("/info", this.getInfoApi);
    return router;
  }

}

export default UserAccountCtrl;
