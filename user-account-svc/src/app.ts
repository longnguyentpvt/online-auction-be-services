import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import UserAccountCtrl from "controllers/user-account-ctrl";

import { config as dbConfig } from "db";

import { ApiError, ApiErrorCode } from "types/app";

class App {
  public app: Application;

  // public routes: Routes = new Routes();
  // public scheduler : Scheduler = new Scheduler();

  constructor() {
    this.app = express();

    dbConfig();

    this.initializeMiddlewares();

    this.initControllers();

    this.addErrorHandler();

  }

  private initControllers(): void {
    const userAccountCtrl = new UserAccountCtrl();

    this.app.use("/user/account", userAccountCtrl.initRoute());
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: "5mb" }));

    // add middleware to extract request user info from auth service
    this.app.use((req: Request, res : Response, next : NextFunction) => {
      const accountId = req.header("X-Account-Id");
      const scopeStr = req.header("X-Account-Scopes");
      if (accountId) {
        const scopes = !!scopeStr ? scopeStr.split(",") : [];

        req["account"] = {
          id : parseInt(accountId),
          scopes
        };
      }

      next();
    });
  }

  private addErrorHandler(): void {
    this.app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
      const {
        rpMessage,
        rpCode,
        message,
        statusCode,
        stack
      } = err;
      const {
        path,
        query,
        body
      } = req;
      const errorCode = rpCode ?? ApiErrorCode.SYSTEM_ERROR;
      const errorMessage = rpMessage ?? "Unexpected system error! Please report this to us.";
      const rpStatusCode = statusCode ?? 500;

      if (errorCode === ApiErrorCode.SYSTEM_ERROR) {
        console.error({
          stack,
          message,
          path,
          query,
          body
        });
      }

      res.status(rpStatusCode).send({
        errorCode: errorCode,
        errorMessage: errorMessage
      });

      next();
    });
  }
}

export default new App().app;
