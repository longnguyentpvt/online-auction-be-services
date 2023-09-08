import request from "supertest";
import { expect, test, describe } from "@jest/globals";

import app from "../src/app";
import { ApiErrorCode } from "../src/types/app";

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
    const userId = 1694016321407;
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
});
