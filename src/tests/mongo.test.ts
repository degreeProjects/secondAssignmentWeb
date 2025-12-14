import mongoose from "mongoose";
import { configMongo } from "../config/mongo";

jest.mock("../config/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("MongoDB connection tests", () => {
  test("Should fail to connect to MongoDB", async () => {
    jest.spyOn(mongoose, "connect").mockImplementationOnce(() => {
      throw new Error("Mongo connection failed");
    });

    await expect(configMongo("mongodb://invalid-url")).rejects.toThrow(
      "Mongo connection failed"
    );
  });
});
