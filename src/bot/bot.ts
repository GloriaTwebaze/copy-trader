import axios from "axios";
import { CONFIG } from "../config/config";
import { Telegraf, Markup, Context } from "telegraf";

/**
 * An interface containing parameters needed when placing orders.
 */
interface OrderParams {
  side: string;
  qty: number;
  order_type: string;
  price?: number;
}

const bot = new Telegraf(CONFIG.TOKEN);
bot.start((ctx) => {
  ctx.reply(
    `Welcome ${ctx.message.from.first_name} let us do some trading.`,
    Markup.inlineKeyboard([
      Markup.button.callback("Buy", "buy"),
      Markup.button.callback("Sell", "sell"),
      Markup.button.callback("Get Price", "get-price"),
    ])
  );
});

/**
 * Places an order depending on the parameters passed and sends appropriate replies to the user through the bot.
 *
 * @param params has the data for the order. It expects an object with `side`,`qty`,`order_type` and an optional `price` depending on whether it is a Limit or Market order
 * @param ctx of type `Context` for sending message spt Telegram.
 */
const placeOrderRequest = async (params: OrderParams, ctx: Context) => {
  try {
    ctx.reply(`Placing ${params.side} order...`);
    const res = await axios.post(
      "http://localhost:5000/api/place-order",
      {
        side: params.side,
        symbol: "ETHUSDT",
        qty: params.qty,
        order_type: params.order_type,
        price: params.price,
      },
      { headers: { Accept: "*/*" } }
    );

    const orderData = res.data.data;

    let message = `<strong>${params.order_type} Order ${orderData.side} for ${orderData.symbol}</strong>`;
    message += `\nUser Id: <strong>${orderData.user_id}</strong>`;
    message += `\nOrder Id: <strong>${orderData.order_id}</strong>`;
    message += `\nSymbol: <strong>${orderData.symbol}</strong>`;
    message += `\nPrice: <strong>${orderData.price}</strong>`;
    message += `\nQuantity: <strong>${orderData.qty}</strong>`;
    ctx.replyWithHTML(message);
  } catch (error) {
    console.error(error);
    ctx.reply(`Something went wrong, try again...`);
  }
};

// Action to place a buy
bot.action("buy", async (ctx) => {
  ctx.reply(
    "Would you like to place a Market or Limit order for the buy?",
    Markup.inlineKeyboard([
      Markup.button.callback("Market Order", "market-order"),
      Markup.button.callback("Limit Order", "limit-order"),
    ])
  );
  // Action to place a market order
  bot.action("market-order", async () => {
    const orderDetails = {
      side: "Buy",
      qty: 0.1,
      order_type: "Market",
    };
    await placeOrderRequest(orderDetails, ctx);
  });

  // Action to place a market order
  bot.action("limit-order", async () => {
    const orderDetails = {
      side: "Buy",
      qty: 0.1,
      order_type: "Limit",
      price: 1800,
    };
    await placeOrderRequest(orderDetails, ctx);
  });
});

// Action to place a sell
bot.action("sell", async (ctx) => {
  ctx.reply(
    "Would you like to place a Market or Limit order for the sell?",
    Markup.inlineKeyboard([
      Markup.button.callback("Market Order", "sell-market-order"),
      Markup.button.callback("Limit Order", "sell-limit-order"),
    ])
  );

  // Action to place a market order
  bot.action("sell-market-order", async () => {
    const orderDetails = {
      side: "Sell",
      qty: 0.1,
      order_type: "Market",
    };
    await placeOrderRequest(orderDetails, ctx);
  });

  // Action to place a market order
  bot.action("sell-limit-order", async () => {
    const orderDetails = {
      side: "Sell",
      qty: 0.1,
      order_type: "Limit",
      price: 1800,
    };
    await placeOrderRequest(orderDetails, ctx);
  });
});

// Action to get ETHUSDT price
bot.action("get-price", async (ctx) => {
  try {
    const res = await axios.get("http://localhost:5000/api/get-price");
    const price = res.data.data;
    ctx.replyWithHTML(
      `The last price for ETHUSDT is <strong>${price}</strong>`
    );
  } catch (error) {
    console.error(error);
    ctx.reply(`Something went wrong, try again...`);
  }
});

export { bot };
