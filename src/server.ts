import express from "express";
import "dotenv/config";
import { CONFIG } from "./config/config";
import configMiddleware from "./middleware/appMiddleware";
import configRoutes from "./routes/index";

const app = express();

const main = () => {
  const PORT = CONFIG.PORT;

  // Middleware
  configMiddleware(app);

  // Routes
  configRoutes(app);

  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
};

main();
