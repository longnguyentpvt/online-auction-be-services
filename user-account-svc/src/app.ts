import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http, { Server as HttpServer } from "http";

import UserAccountCtrl from "controllers/user-account-ctrl";

import { config as dbConfig } from "db";

import { ApiError, ApiErrorCode } from "types/app";

class App {
  public app: Application;
  public server: HttpServer;

  // public routes: Routes = new Routes();
  // public scheduler : Scheduler = new Scheduler();

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);

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

export default new App().server;
