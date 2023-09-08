import { NextFunction, Request, Response, Router } from "express";
import moment from "moment-timezone";

import { validateRequestScope } from "services/session-scope";
import { depositToBalance } from "services/balance-transaction";

import { ApiErrorCode, AppController } from "types/app";
import { DepositError } from "types/services";
import {
  AuthRequest,
  BalanceTransactionResponse,
  DepositRequestBody
} from "types/apis";

class AccountBalanceCtrl implements AppController {

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

  depositBalanceApi = async (
    req: AuthRequest<never, never, DepositRequestBody>,
    res: Response<BalanceTransactionResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { amount } = req.body;
      const userId = req.account.id;

      const {
        errCode,
        data
      } = await depositToBalance(userId, amount);
      // console.log("error", errCode, { email, password, name });

      if (errCode) {
        let rpCode = ApiErrorCode.UNKNOWN,
          rpMessage = "";
        switch (errCode) {
          case DepositError.InvalidAmount:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "Amount is invalid!";
            break;
          case DepositError.InvalidUser:
            rpCode = ApiErrorCode.UNAUTHORIZED;
            rpMessage = "Unknown user!";
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
        amount: tranAmount,
        transactionDateTime,
        status,
        type
      } = data;
      res.status(200).send({
        id,
        amount: tranAmount,
        type,
        status,
        transactionDateTime
      });
    } catch (e) {
      next(e);
    }
  };

  initRoute(): Router {
    const router = Router();
    router.post("/health-check", validateRequestScope(["super-admin"]), this.healthCheck);
    router.post("/deposit", this.depositBalanceApi);
    return router;
  }

}

export default AccountBalanceCtrl;
