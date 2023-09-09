import request from "supertest";
import { expect, test, describe } from "@jest/globals";

import app from "../src/app";
import { ApiErrorCode } from "types/app";
import moment from "moment-timezone";

const sum = (a: number, b: number): number => a + b;
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2))
    .toBe(3);
});

describe("Test Controller Apis", () => {
  test("Account Info Api - Expect Success Response", async (): Promise<void> => {
    const userId = 1694016321406;
    const {
      statusCode,
      body
    } = await request(app)
      .get("/user/account/info")
      .set("X-Account-Id", `${ userId }`);

    expect(statusCode).toBe(200);

    expect(body).toMatchObject({
      id : userId,
      email : "tester1@gmail.com"
    });
  });

  test("Account Info Api - Error Response", async (): Promise<void> => {
    const userId = 9999;
    const {
      statusCode,
      body
    } = await request(app)
      .get("/user/account/info")
      .set("X-Account-Id", `${ userId }`);

    expect(statusCode).toBe(404);
    expect(body).toMatchObject({
      errorCode : ApiErrorCode.NOT_FOUND
    });
  });

  test("Account Registration Api - Expect Success Response", async (): Promise<void> => {
    const nowMm = moment();

    const email = `unittest${ nowMm.valueOf() }@gmail.com`;
    const password = "qwerty123";
    const name = "Unit Test";

    const {
      statusCode,
      body
    } = await request(app)
      .post("/user/account/register")
      .send({
        email,
        password,
        name
      });

    expect(statusCode).toBe(200);
    expect(body).toMatchObject({
      email,
      fullName: name
    });
  });

  test("Account Registration Api - Error Response", async (): Promise<void> => {
    const email = "tester1@gmail.com";
    const password = "qwerty123";
    const name = "Unit Test";

    const {
      statusCode,
      body
    } = await request(app)
      .post("/user/account/register")
      .send({
        email,
        password,
        name
      });

    expect(statusCode).toBe(400);
    expect(body).toMatchObject({
      errorCode : ApiErrorCode.EXISTED
    });
  });
});
