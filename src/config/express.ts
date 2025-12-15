import bodyParser from "body-parser";
import cors from "cors";
import { Express } from "express";
import { configRoutes } from "./routes";
import { configSwagger } from "./swagger";

export const configExpress = (app: Express) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  configRoutes(app);
  configSwagger(app);
};
