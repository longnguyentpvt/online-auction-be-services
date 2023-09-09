import { NextFunction, Request, Response, Router } from "express";
import moment from "moment-timezone";

import { validateRequestScope } from "services/session-scope";
import { retrieveMarketItems } from "services/market-item";

import { AppController } from "types/app";
import {
  AuthRequest,
  DefaultListingResponse,
  MarketItemResponse,
  ItemListingQuery
} from "types/apis";

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
      // console.log("error", errCode, { email, password, name });

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

  initRoute(): Router {
    const router = Router();
    router.post("/health-check", validateRequestScope(["super-admin"]), this.healthCheck);
    router.get("/list", this.listItemsApi);
    return router;
  }

}

export default MarketItemCtrl;
