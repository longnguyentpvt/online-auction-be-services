import request from "supertest";
import { expect, test, describe } from "@jest/globals";

import app from "../src/app";

const sum = (a: number, b: number): number => a + b;
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2))
    .toBe(3);
});

describe("Test Controller Apis", () => {
  test("Listing Api - Expect Success Response", async (): Promise<void> => {
    const userId = 1694016321406;
    const filterStatus = "ongoing";

    const {
      statusCode,
      body
    } = await request(app)
      .get(`/market/items/list?page=1&noRecords=24&filterStatus=${ filterStatus }`)
      .set("X-Account-Id", `${ userId }`);

    expect(statusCode).toBe(200);
    const {
      count,
      items
    } = body;

    expect(count).toBeDefined();
    expect(items).toBeDefined();
  }, 5000);

  // test("Deposit Api - Expect Error Response", async (): Promise<void> => {
  //   const userId = 1694016321406;
  //   const amount = "testamount";
  //   const {
  //     statusCode,
  //     body
  //   } = await request(app)
  //     .post("/account/balance/deposit")
  //     .set("X-Account-Id", `${ userId }`)
  //     .send({
  //       amount
  //     });
  //
  //   expect(statusCode).toBe(400);
  //
  //   expect(body).toMatchObject({
  //     errorCode: ApiErrorCode.INVALID_DATA
  //   });
  // }, 10000);
});
