import express from "express";
import "dotenv/config";
import { CONFIG } from "./config/config";
import { bybitExchange } from "./exchange/bybit";

const app = express();

const main = () => {
  const PORT = CONFIG.PORT;

  // middleware
  app.use(express.json());

  app.get("/public/linear/kline", async (req, res) => {
    const { symbol } = req.body;
    // Get Order book
    const orderBook = await bybitExchange.getOrderBook({ symbol });

    return res.status(200).json({ status: "Success", data: orderBook });
  });

  app.post("/private/linear/order/create", async (req, _res) => {
    const { side, symbol, order_type, qty, price } = req.body;

    const orderToPlace = await bybitExchange.placeOrder({
      side,
      symbol,
      order_type,
      qty,
      price,
      time_in_force: "GoodTillCancel",
      reduce_only: false,
      close_on_trigger: false,
    });

    console.log('Order went through...', orderToPlace);
  });

  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
};

main();
