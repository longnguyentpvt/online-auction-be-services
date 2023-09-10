import { NextFunction, Request, Response, Router } from "express";
import moment from "moment-timezone";

import { validateRequestScope } from "services/session-scope";
import { newBidOnItem } from "services/market-item";

import { ApiErrorCode, AppController } from "types/app";
import {
  AuthRequest,
  ItemBidRequestBody,
  ItemBidResponse
} from "types/apis";
import { NewBidError } from "types/services";

class MarketItemBidCtrl implements AppController {

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

  newBidApi = async (
    req: AuthRequest<never, never, ItemBidRequestBody>,
    res: Response<ItemBidResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.account.id;
      const {
        itemId,
        price
      } = req.body;

      const { errCode, data } = await newBidOnItem(userId, itemId, price);
      console.log("result", {
        errCode,
        userId,
        itemId,
        price
      });
      if (errCode) {
        let rpCode = ApiErrorCode.UNKNOWN,
          rpMessage = "";
        switch (errCode) {
          case NewBidError.ItemNotFound:
            rpCode = ApiErrorCode.NOT_FOUND;
            rpMessage = "Item is not found!";
            break;
          case NewBidError.IncorrectBidTime:
            rpCode = ApiErrorCode.OVER_LIMIT;
            rpMessage = "Please wait for few seconds!";
            break;
          case NewBidError.InvalidPrice:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "New price is lower than current bid!";
            break;
          case NewBidError.InactiveItem:
            rpCode = ApiErrorCode.INACTIVE;
            rpMessage = "Item is in draft or released already!";
            break;
          case NewBidError.InvalidUser:
          case NewBidError.IncorrectItem:
            rpCode = ApiErrorCode.UNAUTHORIZED;
            rpMessage = "Unknown user!";
            break;
          case NewBidError.InsufficientBalance:
            rpCode = ApiErrorCode.INSUFFICIENT_BALANCE;
            rpMessage = "Insufficient account balance!";
            break;
        }

        throw {
          statusCode: 400,
          rpCode,
          rpMessage
        };
      }

      res.status(200).send({ ...data });
    } catch (e) {
      next(e);
    }
  };

  initRoute(): Router {
    const router = Router();
    router.post("/health-check", validateRequestScope(["super-admin"]), this.healthCheck);
    router.post("/new", this.newBidApi);
    return router;
  }

}

export default MarketItemBidCtrl;
