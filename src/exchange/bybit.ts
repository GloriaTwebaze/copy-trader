import {
  LinearCancelOrderRequest,
  LinearClient,
  LinearGetOrdersRequest,
  LinearOrder,
  NewLinearOrder,
  SymbolParam,
  WalletBalances,
} from "bybit-api";
import { CONFIG } from "../config/config";

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

    if (ret_code === 0 && ret_msg === "OK" && result != null) {
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

    return { ret_code, ret_msg };
  };
}

export const bybitExchange = new BybitExchange({
  key: CONFIG.API_KEY,
  secret: CONFIG.API_SECRET,
  testnet: true,
  baseUrl: CONFIG.BASE_URL,
});
