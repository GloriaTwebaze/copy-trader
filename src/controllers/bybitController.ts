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
      reduce_only: false,
      close_on_trigger: false,
      position_idx: 0,
    });
    return res.status(200).json({ success: true, data: orderToPlace });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};
