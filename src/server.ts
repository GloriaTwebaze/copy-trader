import express from "express";
import "dotenv/config";
import { CONFIG } from "./config/config";
import configMiddleware from "./middleware/appMiddleware";
import configRoutes from "./routes/index";
import { bot } from "./bot/bot";

const app = express();

const startBot = () => {
  console.log(`---`.repeat(10));
  console.log(`starting bot  🤖 `);
  console.log(`---`.repeat(10));
  bot
    .launch()
    .then(() => {
      console.log(`bot started  🤖 `);
      console.log(`---`.repeat(10));
    })
    .catch((e) => {
      console.error(e.message);
    });
};

const main = () => {
  const PORT = CONFIG.PORT;

  // Middleware
  configMiddleware(app);

  // Routes
  configRoutes(app);

  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}\n` + "---".repeat(12));
  });
  startBot();
};

main();
