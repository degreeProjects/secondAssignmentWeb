import { Express } from "express";
import postsRoute from "../routes/postRoutes";
import commentsRoute from "../routes/commentRoutes";
import authRoute from "../routes/authRoutes";

export const configRoutes = (app: Express) => {
  app.use("/posts", postsRoute);
  app.use("/comments", commentsRoute);
  app.use("/auth", authRoute);
};
