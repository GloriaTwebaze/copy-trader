import { Request, Response } from "express";
import { bybitExchange } from "../exchange/bybit";

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { side, symbol, order_type, qty, price } = req.body;

    const orderToPlace = await bybitExchange.placeOrder({
      side,
      symbol,
      order_type,
      qty,
      price,
      time_in_force: "GoodTillCancel",
      reduce_only: side === "Sell" ? true : false,
      close_on_trigger: false,
      position_idx: 0,
    });

    if (orderToPlace) {
      return res.status(200).json({ success: true, data: orderToPlace });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong..." });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPrice = async (_req: Request, res: Response) => {
  try {
    const tinkers = await bybitExchange.getPrice({ symbol: "ETHUSDT" });

    if (tinkers) {
      const symbolPrice: number = tinkers[0].last_price;
      console.log("Symbol last price: ", symbolPrice);
      return res.status(200).json({ success: true, data: symbolPrice });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a symbol." });
    }
  } catch (error) {
    return res.status(400).json({ success: true, message: error.message });
  }
};
