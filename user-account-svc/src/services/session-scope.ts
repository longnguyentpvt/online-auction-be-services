import { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { ApiError, ApiErrorCode } from "types/app";

export const validateRequestScope = (scopes: string[]): RequestHandler => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    // scope not defined then continue
    (!scopes || !scopes.length) && next();

    const headerScope = req.header("X-Account-Scopes");
    const userScope: { [key: string]: boolean } = {};
    if (headerScope) {
      headerScope.split(",").forEach((scope: string): void => {
        userScope[scope] = true;
      });
    }

    const foundValidScope = scopes.find((scope: string) => userScope[scope]);
    if (foundValidScope) {
      next();
    } else {
      const error : ApiError = {
        statusCode : 403,
        rpCode : ApiErrorCode.UNAUTHORIZED,
        rpMessage : "Scope is invalid!"
      };
      throw error;
    }
  };
};
