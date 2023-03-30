import { Application } from "express";
import router from "./routes";

export default (app: Application) => {
  app.use("/api/", router);
};
