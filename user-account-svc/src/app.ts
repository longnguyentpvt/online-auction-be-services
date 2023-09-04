import express, {
  Application,
  Request,
  Response,
  NextFunction
} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http, { Server as HttpServer } from "http";

import { config as dbConfig } from "db";

class App {
  public app : Application;
  public server : HttpServer;

  // public routes: Routes = new Routes();
  // public scheduler : Scheduler = new Scheduler();

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.initializeMiddlewares();
    dbConfig();

    this.initControllers();

    this.addErrorHandler();

  }

  private initControllers() : void {
  }

  private initializeMiddlewares() : void {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit : "5mb" }));
  }

  private addErrorHandler() : void {
  }
}

export default new App().server;
