import {
  LinearClient,
  LinearGetOrdersRequest,
  LinearOrder,
  NewLinearOrder,
  SymbolParam,
  WalletBalances,
} from "bybit-api";
import { CONFIG } from "../config/config";
import { IChaseOrder } from "../types/interface";
import { getOrderStatus, sleep } from "../utils/utils";

export class BybitExchange {
  private linear: LinearClient;

  constructor(params: {
    key: string;
    secret: string;
    testnet: boolean;
    baseUrl: string;
  }) {
    this.linear = new LinearClient(params);
  }

  /**
   * A function to get an Market Price for ETHUSDT
   * @param params
   * @returns an array
   */
  getPrice = async (symbol: SymbolParam): Promise<any[] | null> => {
    const tickers = await this.linear.getTickers(symbol);

    const { ret_code, ret_msg, result } = tickers;

    if (ret_code === 0 && ret_msg === "OK") {
      return result;
    } else {
      console.log("Received Tickers: ", tickers);
      return null;
    }
  };

  /**
   * Gets Wallet Balances
   *
   * @returns object contain Wallet Balances
   */
  getWalletBalance = async (): Promise<WalletBalances | null> => {
    const walletBalances = await this.linear.getWalletBalance();
    const { ret_code, ret_msg, result } = walletBalances;

    if (ret_code === 0 && ret_msg === "OK" && result) {
      return result;
    } else {
      console.log("Error: ", { ret_code, ret_msg });
      return null;
    }
  };

  /**
   * Returns the orders of a user
   *
   * @param params of type LinearGetOrdersRequest specifying the symbol for which to return orders
   * @returns an object with the orders
   */
  getOrders = async (params: LinearGetOrdersRequest): Promise<any | null> => {
    const orders = await this.linear.getActiveOrderList(params);
    const { ret_code, ret_msg, result } = orders;

    if (ret_code === 0 && ret_msg === "OK" && result != null) {
      return result;
    } else {
      console.error({ ret_code, ret_msg, result });
      return null;
    }
  };

  getPosition = async (params: SymbolParam) => {
    const positions = await this.linear.getPosition(params);
    const { ret_code, ret_msg, result } = positions;

    if (ret_code === 0 && ret_msg === "OK" && result != null) {
      return result;
    } else {
      console.error({ ret_code, ret_msg, result });
      return null;
    }
  };

  /**
   * Places a buy or sell order.
   *
   * @param params of type `NewLinearOrder`
   * @returns `LinearOrder`
   */
  placeOrder = async (params: NewLinearOrder): Promise<LinearOrder | null> => {
    const order = await this.linear.placeActiveOrder(params);
    const { ret_code, ret_msg, result } = order;

    if (ret_code === 0 && ret_msg === "OK" && result != null) {
      return { ...result };
    } else {
      console.log("Placed Order: ", order);
      return null;
    }
  };

  cancelOrders = async (params: SymbolParam): Promise<any | null> => {
    const cancelOrder = await this.linear.cancelAllActiveOrders(params);
    const { ret_code, ret_msg } = cancelOrder;

    console.log({ ret_code, ret_msg });

    return { ret_code, ret_msg };
  };

  chaseOrder = async (params: IChaseOrder) => {
    const { orderId, symbol, side } = params;

    let count: number = 0;
    const maxRetries = 100;

    while (true) {
      if (!orderId) {
        console.log("There is no order to chase after.");
        break;
      }

      await sleep(10000);

      let price = await this.getPrice({ symbol });

      if (price) {
        let livePrice = price[0].last_price;

        if (!livePrice) {
          console.log("No Price fetched.");
          break;
        }

        livePrice =
          side === "Buy" ? livePrice - 0.05 : parseFloat(livePrice) + 0.1;

        const { result } = await this.linear.replaceActiveOrder({
          symbol,
          order_id: orderId,
          p_r_price: livePrice.toFixed(2),
        });

        count += 1;
        const orderStatus = await getOrderStatus(orderId, symbol);

        if (
          (Object.keys(result).length === 0 && orderStatus?.status === "Filled") ||
          count === maxRetries
        ) {
          return orderStatus?.price
          break;
        }
      }
    }
  };
}

export const bybitExchange = new BybitExchange({
  key: CONFIG.API_KEY,
  secret: CONFIG.API_SECRET,
  testnet: true,
  baseUrl: CONFIG.BASE_URL,
});
// function sleep(arg0: number) {
//   throw new Error("Function not implemented.");
// }
