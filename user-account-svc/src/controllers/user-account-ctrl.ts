import { Router, NextFunction, Request, Response } from "express";
import moment from "moment-timezone";

import { validateRequestScope } from "services/session-scope";

import { AppController } from "types/app";

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

  initRoute(): Router {
    const router = Router();
    router.post("/health-check", validateRequestScope(["super-admin"]), this.healthCheck);
    return router;
  }

}

export default UserAccountCtrl;
