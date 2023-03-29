import {
  LinearClient,
  LinearOrder,
  NewLinearOrder,
  SymbolParam,
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
   * A function to get an Orderbook
   * @param params
   * @returns an array
   */
  getOrderBook = async (params: SymbolParam): Promise<any[] | null> => {
    const orderBook = await this.linear.getOrderBook({ symbol: params.symbol });
    if (orderBook) {
      return [orderBook];
    } else {
      return null;
    }
  };

  placeOrder = async (params: NewLinearOrder): Promise<LinearOrder | null> => {
    const order = await this.linear.placeActiveOrder(params);
    console.log("Placed Order: ", order);
    return null;
  };
}

export const bybitExchange = new BybitExchange({
  key: CONFIG.API_KEY,
  secret: CONFIG.API_SECRET,
  testnet: true,
  baseUrl: CONFIG.BASE_URL,
});
