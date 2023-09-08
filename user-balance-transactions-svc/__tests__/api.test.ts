import request from "supertest";
import { expect, test, describe } from "@jest/globals";
import moment from "moment-timezone";

import app from "../src/app";

import { ApiErrorCode } from "types/app";
import { TransactionStatus, TransactionType } from "types/db-models";

const sum = (a: number, b: number): number => a + b;
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2))
    .toBe(3);
});

describe("Test Controller Apis", () => {
  test("Deposit Api - Expect Success Response", async (): Promise<void> => {
    const userId = 1694016321406;
    const amount = 100;
    const {
      statusCode,
      body
    } = await request(app)
      .post("/account/balance/deposit")
      .set("X-Account-Id", `${ userId }`)
      .send({
        amount
      });

    expect(statusCode).toBe(200);

    expect(body).toMatchObject({
      type: TransactionType.Deposit,
      status : TransactionStatus.Success,
      amount
    });
  }, 10000);

  test("Deposit Api - Expect Error Response", async (): Promise<void> => {
    const userId = 1694016321406;
    const amount = "testamount";
    const {
      statusCode,
      body
    } = await request(app)
      .post("/account/balance/deposit")
      .set("X-Account-Id", `${ userId }`)
      .send({
        amount
      });

    expect(statusCode).toBe(400);

    expect(body).toMatchObject({
      errorCode: ApiErrorCode.INVALID_DATA
    });
  }, 10000);
});
