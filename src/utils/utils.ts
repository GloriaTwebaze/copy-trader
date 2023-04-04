import { CronJob } from "cron";
import { bybitExchange } from "../exchange/bybit";

const getInitialPrice = async () => {
  const priceList = await bybitExchange.getPrice({ symbol: "ETHUSDT" });

  let initialPrice;

  if (priceList) {
    initialPrice = priceList[0].last_price;
    return initialPrice;
  }
};

const getPriceDifference = async (
  previousPrice: number,
  currentPrice: number
) => {
  const priceDifference = currentPrice - previousPrice;

  if (priceDifference <= -0.05) {
    const bought = await bybitExchange.placeOrder({
      symbol: "ETHUSDT",
      side: "Buy",
      qty: 0.09,
      time_in_force: "GoodTillCancel",
      reduce_only: false,
      close_on_trigger: false,
      order_type: "Market",
    });
    console.log("Bought, just bought", bought);
  } else if (priceDifference >= 0.07) {
    const sold = await bybitExchange.placeOrder({
      symbol: "ETHUSDT",
      side: "Sell",
      qty: 0.07,
      time_in_force: "GoodTillCancel",
      reduce_only: false,
      close_on_trigger: false,
      order_type: "Market",
    });
    console.log("sold", sold);
  } else {
    console.log("price priceDifference", priceDifference);
  }
};

export const monitorPrice = async () => {
  let previousLastPrice = await getInitialPrice();
  let currentLastPrice = await getInitialPrice();
  const job = new CronJob("*/3 * * * * *", async () => {
    const priceList = await bybitExchange.getPrice({ symbol: "ETHUSDT" });

    if (priceList) {
      previousLastPrice = currentLastPrice;
      console.log("Previous Last Price: ", previousLastPrice);

      currentLastPrice = priceList[0].last_price;
      console.log("Current Last Price: ", currentLastPrice);

      getPriceDifference(
        parseFloat(previousLastPrice),
        parseFloat(currentLastPrice)
      );
      console.log("---".repeat(10));
    }
  });
  job.start();
};
