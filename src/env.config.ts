import * as env from "env-var";
import "dotenv/config";

const config = {
  port: env.get("PORT").default("3000").asPortNumber(),
  dbUrl: env.get("DB_URL").required().asString(),
};

export default config;