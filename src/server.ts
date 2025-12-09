import { initApp } from "./app";
import { logger } from "./config/logger";
import config from "./env.config";

const bootstrapServer = async () => {
  const app = await initApp();

  const port = config.port ?? 3000;

  app.listen(port, () => {
    logger.info("Server running on port " + port);
  });
};

bootstrapServer();
