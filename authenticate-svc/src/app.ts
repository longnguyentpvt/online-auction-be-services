import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import AuthenticateCtrl from "controllers/authenticate-ctrl";

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
    const authenticateCtrl = new AuthenticateCtrl();

    this.app.use("/authenticate", authenticateCtrl.initRoute());
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log("Json middleware called", req.path);
      if (req.path.indexOf("/authenticate/access") < 0) {
        console.log("Json middleware processing", req.path);
        bodyParser.json({
          limit: "5mb"
        })(req, res, next);
      } else {
        next();
      }
    });

    // add middleware to extract request user info from auth service
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const accountId = req.header("X-Account-Id");
      const scopeStr = req.header("X-Account-Scopes");
      const token = req.header("Access-Token");
      if (accountId) {
        const scopes = !!scopeStr ? scopeStr.split(",") : [];

        req["account"] = {
          id: parseInt(accountId),
          scopes,
          token
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
