import {
  LinearClient,
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
}

export const bybitExchange = new BybitExchange({
  key: CONFIG.API_KEY,
  secret: CONFIG.API_SECRET,
  testnet: true,
  baseUrl: CONFIG.BASE_URL,
});
