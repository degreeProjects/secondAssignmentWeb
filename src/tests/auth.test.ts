process.env.JWT_EXPIRATION = "4s";

import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { initApp } from "../app";
import { UserModel } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../env.config";

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
  await UserModel.deleteMany({ email: `${user.email}1` });
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

  test("Test Register unexpected error", async () => {
    jest
      .spyOn(UserRepository.prototype, "create")
      .mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app)
      .post("/auth/register")
      .send({
        email: `${user.email}1`,
        password: user.password,
        username: user.username,
      });

    expect(response.statusCode).toBe(500);
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

  test("Test Login unexpected error", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toBe(500);
  });

  test("Test Login initializes refreshTokens when undefined", async () => {
    const mockUser: any = {
      _id: new mongoose.Types.ObjectId(),
      email: user.email,
      password: "hashedPassword",
      save: jest.fn().mockResolvedValue(undefined),
    };

    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValueOnce(mockUser);

    jest.spyOn(bcrypt, "compare").mockImplementationOnce(async () => true);

    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(mockUser.refreshTokens)).toBe(true);
    expect(mockUser.refreshTokens.length).toBe(1);
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

  test("Test refresh token with expired refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTNhYzNjNzI5ZDhjMWY4ZjFlYTBkNWYiLCJpYXQiOjE3NjU0NTg4ODh9.hMV3EVn0Z-cSdBWLofueWGLNwH1sZ47jpopyPUY3ClM"
      )
      .send();
    expect(response.statusCode).toBe(401);
  });

  test("Test refresh token with invalid refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJAUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTNhYzNjNzI5ZDhjMWY4ZjFlYTBkNWYiLCJpYXQiOjE3NjU0NTg4ODh9.hMV3EVn0Z-cSdBWLofueWGLNwH1sZ47jpopyPUY3ClM"
      )
      .send();
    expect(response.statusCode).toBe(401);
  });

  test("Test Refresh unexpected error", async () => {
    jest
      .spyOn(UserRepository.prototype, "getById")
      .mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + refreshToken)
      .send();

    expect(response.statusCode).toBe(500);
  });

  test("Test Refresh with unrecognized refresh token in user refreshTokens", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const refreshTokenUnderTest = jwt.sign(
      { _id: userId },
      config.jwtRefreshSecret
    );

    const mockUser: any = {
      _id: userId,
      email: "refresh@test.com",
      password: "hashed",
      refreshTokens: [], // does NOT contain the provided token
      save: jest.fn().mockResolvedValue(undefined),
    };

    jest
      .spyOn(UserRepository.prototype, "getById")
      .mockResolvedValueOnce(mockUser);

    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "Bearer " + refreshTokenUnderTest);

    expect(response.statusCode).toBe(401);
    expect(mockUser.refreshTokens).toEqual([]);
    expect(mockUser.save).toHaveBeenCalled();
  });

  test("Test Logout with unrecognized refresh token in user refreshTokens", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const refreshTokenUnderTest = jwt.sign(
      { _id: userId },
      config.jwtRefreshSecret
    );

    const mockUser: any = {
      _id: userId,
      email: "logout@test.com",
      password: "hashed",
      refreshTokens: [], // does NOT contain the provided token
      save: jest.fn().mockResolvedValue(undefined),
    };

    jest
      .spyOn(UserRepository.prototype, "getById")
      .mockResolvedValueOnce(mockUser);

    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "Bearer " + refreshTokenUnderTest);

    expect(response.statusCode).toBe(401);
    expect(mockUser.refreshTokens).toEqual([]);
    expect(mockUser.save).toHaveBeenCalled();
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

  test("Test Logout without refresh token", async () => {
    const response = await request(app).get("/auth/logout");
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

  test("Test Logout unexpected error", async () => {
    const loginRes = await request(app).post("/auth/login").send(user);

    jest
      .spyOn(UserRepository.prototype, "getById")
      .mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "Bearer " + loginRes.body.refreshToken);

    expect(response.statusCode).toBe(500);
  });
});
