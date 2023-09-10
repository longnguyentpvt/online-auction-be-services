import request from "supertest";
import { expect, test, describe } from "@jest/globals";

import app from "../src/app";

const sum = (a: number, b: number): number => a + b;
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2))
    .toBe(3);
});

describe("Test Controller Apis", () => {
  test("Token Authentication Api - Expect Success Response", async (): Promise<void> => {
    const token = "112a1047e3a60ca06bfc7a5fbb4c5cf5";
    const {
      statusCode,
      headers
    } = await request(app)
      .get("/authenticate/access")
      .set("Access-Token", token);

    expect(statusCode).toBe(200);
    expect(headers["x-account-id"]).toBe("1694016321406");

    // expect(body).toMatchObject({
    //   id : userId,
    //   email : "tester1@gmail.com"
    // });
  });

  test("Account Authentication Api - Expect Success Response", async (): Promise<void> => {
    const userId = 1694016321406;
    const username = "tester1@gmail.com";
    const password = "qwerty123";
    const {
      statusCode,
      body
    } = await request(app)
      .post("/authenticate/account")
      .send({
        username,
        password
      });

    expect(statusCode).toBe(200);

    expect(body).toMatchObject({
      id : userId,
      email : username
    });
  });

  // test("Account Info Api - Error Response", async (): Promise<void> => {
  //   const userId = 1694016321407;
  //   const {
  //     statusCode,
  //     body
  //   } = await request(app)
  //     .get("/user/account/info")
  //     .set("X-Account-Id", `${ userId }`);
  //
  //   expect(statusCode).toBe(404);
  //   expect(body).toMatchObject({
  //     errorCode : ApiErrorCode.NOT_FOUND
  //   });
  // });
});
