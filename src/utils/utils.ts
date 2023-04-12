import { bybitExchange } from "../exchange/bybit";

export const getOrderStatus = async (order_id: string, symbol: string) => {
  const orders = await bybitExchange.getOrders({ symbol });
  const ordersData = orders.data;

  if (ordersData) {
    for (const orderItem of ordersData) {
      if (orderItem.order_id === order_id) {
        const itemStatus = orderItem.order_status;
        const itemPrice = orderItem.price;
        
        return { status: itemStatus, price: itemPrice };
      }
      break;
    }
  }
  console.log("There are no Orders");
  return null;
};

export function sleep(ms: number | undefined) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
