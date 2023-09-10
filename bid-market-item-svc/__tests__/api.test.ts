import request from "supertest";
import { expect, test, describe } from "@jest/globals";
import moment from "moment-timezone";

import app from "../src/app";

import { BidStatus } from "types/db-models";
import { ApiErrorCode } from "types/app";

const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve: ((value: void | PromiseLike<void>) => void)) =>
    setTimeout(resolve, ms));
};

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
    expect(items.length).toBeDefined();
  }, 5000);


  const userId = 1694016321406;
  const bidUserId = 1694016321407;
  const startPrice = 1000;
  let newItemId: number = null;

  test("Add Item Api - Expect Success Response", async (): Promise<void> => {
    const name = `New Item ${ moment().valueOf() }`;

    const {
      statusCode,
      body
    } = await request(app)
      .post("/market/items/new")
      .set("X-Account-Id", `${ userId }`)
      .send({ name });

    expect(statusCode).toBe(200);
    expect(body).toMatchObject({
      name,
      ownerId: userId,
      released: false
    });

    newItemId = body.id;
  }, 5000);

  test("Publish Item Api - Expect Success Response", async (): Promise<void> => {
    const duration = 1;

    const {
      statusCode: publishStatusCode,
      body: publishBody
    } = await request(app)
      .put("/market/items/publish")
      .set("X-Account-Id", `${ userId }`)
      .send({
        itemId: newItemId,
        startPrice,
        duration
      });

    expect(publishStatusCode).toBe(200);
    expect(publishBody).toMatchObject({
      id: newItemId,
      startPrice,
      ownerId: userId
    });
  }, 5000);

  test("Bid Item Api - Expect Success Response", async (): Promise<void> => {
    const bidPrice = startPrice + 100;
    const {
      statusCode: bidStatusCode,
      body: bidBody
    } = await request(app)
      .post("/market/item/bid/new")
      .set("X-Account-Id", `${ bidUserId }`)
      .send({
        itemId: newItemId,
        price: bidPrice
      });

    expect(bidStatusCode).toBe(200);
    expect(bidBody).toMatchObject({
      itemId: newItemId,
      bidderId: bidUserId,
      price: bidPrice,
      status: BidStatus.Success
    });
  }, 5000);

  test("Bid Item Api - Expect Error Insufficient Response", async (): Promise<void> => {
    const insufficientUserId = 1694016321408;
    const bidPrice = startPrice + 200;
    const {
      statusCode: bidStatusCode,
      body: bidBody
    } = await request(app)
      .post("/market/item/bid/new")
      .set("X-Account-Id", `${ insufficientUserId }`)
      .send({
        itemId: newItemId,
        price: bidPrice
      });

    expect(bidStatusCode).toBe(400);
    expect(bidBody).toMatchObject({
      errorCode: ApiErrorCode.INSUFFICIENT_BALANCE
    });
  }, 5000);
});
