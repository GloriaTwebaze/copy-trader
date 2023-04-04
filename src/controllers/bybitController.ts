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

export const getPrice = async (req: Request, res: Response) => {
  const { symbol } = req.body;

  try {
    const tinkers = await bybitExchange.getPrice({ symbol });

    if (tinkers) {
      const symbolPrice: number = tinkers[0].last_price;
      console.log("First Tinkers: ", tinkers[0]);
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

export const getWalletBalances = async (_req: Request, res: Response) => {
  try {
    const walletBalances = await bybitExchange.getWalletBalance();

    const balances = {
      ETH: walletBalances?.ETH?.available_balance.toFixed(3),
      BTC: walletBalances?.BTC?.available_balance.toFixed(3),
      USDT: walletBalances?.USDT?.available_balance.toFixed(3),
    };
    return res.status(200).json({ success: true, data: balances });
  } catch (e) {
    console.error(e.message);
    return res.status(200).json({ success: false, message: e.message });
  }
};

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await bybitExchange.getOrders({ symbol: "ETHUSDT" });
    const ordersToGet = 3;
    const ordersData: any[] = orders.data;

    if (ordersData) {
      let topOrders: any[] = [];

      for (let i = 0; i < ordersToGet; i++) {
        let order = ordersData[i];
        const orderData = {
          orderId: order.order_id,
          price: order.price,
          symbol: order.symbol,
          side: order.side,
          qty: order.qty,
          orderType: order.order_type,
          status: order.order_status,
        };

        topOrders.push(orderData);
      }

      return res.status(200).json({ success: true, data: topOrders });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "There are no orders." });
    }
  } catch (e) {
    console.error(e.message);
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const cancelOrder = async (_req: Request, res: Response) => {
  try {
    const orderCancel = await bybitExchange.cancelOrders({ symbol: "ETHUSDT" });

    if (orderCancel.ret_code === 0) {
      res
        .status(200)
        .json({ success: true, message: "Successfully Cancelled" });
    } else {
      res.status(400).json({
        success: false,
        message: "There are no active orders to cancel.",
      });
    }
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getPosition = async (req: Request, res: Response) => {
  const { symbol } = req.body;

  try {
    const positions = await bybitExchange.getPosition({ symbol });

    console.log("Positins Got: ", positions);

    return res.status(200).json({ success: true, data: positions });

    // if (positions) {
    //   const symbolPrice: number = tinkers[0].last_price;
    //   console.log("Symbol last price: ", symbolPrice);
    //   return res.status(200).json({ success: true, data: symbolPrice });
    // } else {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Please provide a symbol." });
    // }
  } catch (error) {
    return res.status(400).json({ success: true, message: error.message });
  }
};
