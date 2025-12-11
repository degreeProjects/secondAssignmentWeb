process.env.JWT_EXPIRATION = "4s";

import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { initApp } from "../app";
import { UserModel } from "../models/userModel";

let app: Express;

interface IUserPayload {
  email: string;
  password: string;
  username: string;
}

const user: IUserPayload = {
  email: "test@auth.test",
  password: "1234567890",
  username: "testUsername",
};

beforeAll(async () => {
  app = await initApp();
  await UserModel.deleteMany({ email: user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

describe("Auth tests", () => {
  test("Test Register", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(201);
  });

  test("Test Register exist email", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(409);
  });

  test("Test Register missing password", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ email: user.email });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
  });

  test("Test Login without password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login with email not registered", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "blabla@gmail.com",
      password: user.password,
    });
    expect(response.statusCode).toBe(401);
  });

  test("Test Login with incorrect password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: "incorrectPassword",
    });
    expect(response.statusCode).toBe(401);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + refreshToken)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    newRefreshToken = response.body.refreshToken;
  });

  test("Test refresh token without sending refresh token", async () => {
    const response = await request(app).get("/auth/refresh").send();
    expect(response.statusCode).toBe(401);
  });

  test("Test refresh token with invalid refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTNhYzNjNzI5ZDhjMWY4ZjFlYTBkNWYiLCJpYXQiOjE3NjU0NTg4ODh9.hMV3EVn0Z-cSdBWLofueWGLNwH1sZ47jpopyPUY3ClM"
      )
      .send();
    expect(response.statusCode).toBe(401);
  });

  test("Test Logout", async () => {
    const loginRes = await request(app).post("/auth/login").send(user);
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "Bearer " + loginRes.body.refreshToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test Logout with not existing refresh token", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "Bearer maccabi");
    expect(response.statusCode).toBe(401);
  });

  test("Test Logout with invalid refresh token", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTNhYzNjNzI5ZDhjMWY4ZjFlYTBkNWYiLCJpYXQiOjE3NjU0NTg4ODh9.hMV3EVn0Z-cSdBWLofueWGLNwH1sZ47jpopyPUY3ClM"
      );
    expect(response.statusCode).toBe(401);
  });
});
