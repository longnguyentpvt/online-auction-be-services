import { NextFunction, Request, Response, Router } from "express";
import moment from "moment-timezone";

import { validateRequestScope } from "services/session-scope";
import { newItem, publishItem, retrieveMarketItems } from "services/market-item";

import { ApiErrorCode, AppController } from "types/app";
import {
  AuthRequest,
  DefaultListingResponse,
  MarketItemResponse,
  ItemListingQuery,
  NewItemRequestBody,
  PublishItemRequestBody
} from "types/apis";
import { NewItemError, PublishItemError } from "types/services";

class MarketItemCtrl implements AppController {

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

  listItemsApi = async (
    req: AuthRequest<never, never, never, ItemListingQuery>,
    res: Response<DefaultListingResponse<MarketItemResponse>>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.account.id;
      const {
        owner,
        page: pageParam,
        noRecords: noRecordsParam,
        filterStatus
      } = req.query;

      const page = pageParam ? parseInt(pageParam) : 1;
      const noRecords = noRecordsParam ? parseInt(noRecordsParam) : 24;
      const ownerId = "me" === owner && userId;
      let orderBy: "created" | "published" = "published";
      if (!!ownerId) {
        orderBy = "created";
      }

      const { data } = await retrieveMarketItems(ownerId, filterStatus, orderBy, page, noRecords);

      const {
        items,
        count
      } = data;
      res.status(200).send({
        items,
        count
      });
    } catch (e) {
      next(e);
    }
  };

  addItemToMarketApi = async (
    req: AuthRequest<never, never, NewItemRequestBody>,
    res: Response<MarketItemResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.account.id;
      const {
        name
      } = req.body;

      const { errCode, data } = await newItem(userId, name);
      if (errCode) {
        let rpCode = ApiErrorCode.UNKNOWN,
          rpMessage = "";
        switch (errCode) {
          case NewItemError.InvalidName:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "Request data is invalid!";
            break;
          case NewItemError.InvalidUser:
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

      res.status(200).send({ ...data });
    } catch (e) {
      next(e);
    }
  };

  publishItemToMarketApi = async (
    req: AuthRequest<never, never, PublishItemRequestBody>,
    res: Response<MarketItemResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.account.id;
      const {
        itemId,
        duration,
        startPrice
      } = req.body;

      const { errCode, data } = await publishItem(userId, itemId, startPrice, duration);
      if (errCode) {
        let rpCode = ApiErrorCode.UNKNOWN,
          rpMessage = "";
        switch (errCode) {
          case PublishItemError.InvalidDuration:
          case PublishItemError.InvalidPrice:
          case PublishItemError.ItemNotFound:
            rpCode = ApiErrorCode.INVALID_DATA;
            rpMessage = "Request data is invalid!";
            break;
          case PublishItemError.ItemPublishedAlready:
            rpCode = ApiErrorCode.EXISTED;
            rpMessage = "Item is already published!";
            break;
          case PublishItemError.InvalidUser:
          case PublishItemError.IncorrectItem:
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

      res.status(200).send({ ...data });
    } catch (e) {
      next(e);
    }
  };

  initRoute(): Router {
    const router = Router();
    router.post("/health-check", validateRequestScope(["super-admin"]), this.healthCheck);
    router.get("/list", this.listItemsApi);
    router.post("/new", this.addItemToMarketApi);
    router.put("/publish", this.publishItemToMarketApi);
    return router;
  }

}

export default MarketItemCtrl;
