import { initApp } from "../app";
import { configMongo } from "../config/mongo";
import { logger } from "../config/logger";

jest.mock("../config/mongo", () => ({
  configMongo: jest.fn(),
}));

jest.mock("../config/logger", () => ({
  initLogger: jest.fn(),
  logger: { error: jest.fn() },
}));

describe("initApp", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("logs and rethrows when configMongo fails", async () => {
    const error = new Error("mongo fail");
    (configMongo as jest.Mock).mockRejectedValueOnce(error);

    await expect(initApp()).rejects.toThrow(error);
    expect(logger.error).toHaveBeenCalledWith(error);
  });
});
