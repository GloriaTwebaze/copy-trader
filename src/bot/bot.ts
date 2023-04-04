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
  symbol: string;
}

const baseAPIURL = CONFIG.BASE_API_URL;

const bot = new Telegraf(CONFIG.TOKEN);
bot.start((ctx) => {
  ctx.reply(
    `Welcome ${ctx.message.from.first_name}. Let us do some trading!!\nClick on the menu to select a command to run.`
  );
});

/**
 * Places an order depobjectending on the parameters passed and sends appropriate replies to the user through the bot.
 *
 * @param params has the data for the order. It expects an object with `side`,`qty`,`order_type` and an optional `price` depending on whether it is a Limit or Market order
 * @param ctx of type `Context` for sending message spt Telegram.
 */
const placeOrderRequest = async (params: OrderParams, ctx: Context) => {
  try {
    ctx.reply(`Placing ${params.side} order...`);
    const res = await axios.post(
      `${baseAPIURL}/place-order`,
      {
        side: params.side,
        symbol: params.symbol,
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

/**
 * Place a market sell or buy order
 *
 * @param side `Buy` or `Sell` side
 */
const marketOrder = (side: string) => {
  // Command to handle setting a market order
  bot.command(`market_${side}`.toLocaleLowerCase(), async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);
    if (args.length > 2) {
      ctx.reply("Please check that your reply matches the format provided.");
    }
    const [symbol, qty] = args;

    try {
      const orderDetails = {
        side: side,
        qty: parseFloat(qty),
        order_type: "Market",
        symbol: symbol,
      };
      await placeOrderRequest(orderDetails, ctx);
    } catch (e) {
      console.error(e.message);
      ctx.reply("Something went wrong, try again...");
    }
  });
};

/**
 * Place a limit sell or buy order
 *
 * @param side `Buy` or `Sell` side
 */
const limitOrder = (side: string) => {
  // Command to handle setting a market order
  bot.command(`limit_${side}`.toLocaleLowerCase(), async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);
    if (args.length > 3) {
      ctx.reply("Please check that your reply matches the format provided.");
    }
    const [symbol, qty, price] = args;

    try {
      const orderDetails = {
        side: side,
        qty: parseFloat(qty),
        order_type: "Limit",
        symbol: symbol,
        price: parseFloat(price),
      };
      await placeOrderRequest(orderDetails, ctx);
    } catch (e) {
      console.error(e.message);
      ctx.reply("Something went wrong, try again...");
    }
  });
};

/**
 * Get price of pair specified in reply.
 */
const getPrice = () => {
  bot.command("price", async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);
    if (args.length > 1) {
      ctx.reply("Please check that your reply matches the format provided.");
    }
    const [symbol] = args;

    try {
      const res = await axios.get(`${baseAPIURL}/get-price`, {
        data: { symbol },
      });
      const price = res.data.data;
      ctx.replyWithHTML(
        `The last price for <strong>${symbol}</strong> is <strong>${price}</strong>`
      );
    } catch (error) {
      console.error(error);
      ctx.reply(`Something went wrong, try again...`);
    }
  });
};

/**
 * Get orders of pair specified in reply.
 */
const getOrders = () => {
  bot.command("orders", async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);
    if (args.length > 1) {
      ctx.reply("Please check that your reply matches the format provided.");
    }

    const [symbol] = args;

    try {
      const res = await axios.get(`${baseAPIURL}/get-orders`, {
        data: { symbol },
      });

      const orders = res.data.data;

      let message: string = `<strong>Your Orders</strong>`;

      for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        console.log("Order: ", order);
        message += `\n<strong>Order ${i + 1}</strong>`;
        message += `\nOrder ID: <strong>${order.orderId}</strong>`;
        message += `\nPrice: <strong>${order.price}</strong>`;
        message += `\nSymbol: <strong>${order.symbol}</strong>`;
        message += `\nSide: <strong>${order.side}</strong>`;
        message += `\nQuantity: <strong>${order.qty}</strong>`;
        message += `\nStatus: <strong>${order.status}</strong>\n`;
        message += `---`.repeat(10);
      }
      ctx.replyWithHTML(message);
    } catch (e) {
      console.error(e.message);
      ctx.reply("Something went wrong, try again...");
    }
  });
};

/**
 * Cancel active orders of pair specified in reply. This can only cancel orders that have not been `Filled` or `Partially Filled` yet.
 */
const cancelOrders = () => {
  bot.command("cancel", async (ctx) => {
    const args = ctx.message.text.split(" ").slice(1);
    if (args.length > 1) {
      ctx.reply("Please check that your reply matches the format provided.");
    }

    const [symbol] = args;

    try {
      await axios.get(`${baseAPIURL}/cancel-order`);
      ctx.reply("You have successfully cancelled active orders.");
    } catch (error) {
      console.error(error);
      ctx.reply(`Something went wrong, try again...`);
    }
  });
};

// Action to place a buy
bot.command("buy", async (ctx) => {
  ctx.reply(
    "Would you like to place a Market or Limit order for the buy?",
    Markup.inlineKeyboard([
      Markup.button.callback("Market Order", "market_order"),
      Markup.button.callback("Limit Order", "limit_order"),
    ])
  );
  // Action to place a market order
  bot.action("market_order", async () => {
    ctx.replyWithHTML(
      "To proceed with a Market buy order, reply with the pair and quantity you would like to trade with. \nFollow the format: <strong>/market_buy PAIR quantity (/market_buy BTCUSDT 0.2)</strong>"
    );

    marketOrder("Buy");
  });

  // Action to place a market order
  bot.action("limit_order", async () => {
    ctx.replyWithHTML(
      "To proceed with a Limit buy order, reply with the pair quantity and price you would like to trade with. \nFollow the format: <strong>/limit PAIR quantity price (/limit BTCUSDT 0.2 28290)</strong>"
    );

    limitOrder("Buy");
  });
});

// Action to place a sell
bot.command("sell", async (ctx) => {
  ctx.reply(
    "Would you like to place a Market or Limit order for the sell?",
    Markup.inlineKeyboard([
      Markup.button.callback("Market Order", "sell_market_order"),
      Markup.button.callback("Limit Order", "sell_limit_order"),
    ])
  );

  // Action to place a market order
  bot.action("sell_market_order", async () => {
    ctx.replyWithHTML(
      "To proceed with a Market sel order, reply with the pair and quantity you would like to trade with. \nFollow the format: <strong>/market_sell PAIR quantity (/market_sell BTCUSDT 0.2)</strong>"
    );

    marketOrder("Sell");
  });

  // Action to place a market order
  bot.action("sell_limit_order", async () => {
    ctx.replyWithHTML(
      "To proceed with a Limit sell order, reply with the pair quantity and price you would like to trade with. \nFollow the format: <strong>/limit_sell PAIR quantity price (/limit_sell BTCUSDT 0.2 28290)</strong>"
    );

    limitOrder("Sell");
  });
});

// Action to get ETHUSDT price
bot.command("get_price", async (ctx) => {
  ctx.replyWithHTML(
    "To get the price, reply with the pair you would like to fetch the price for. \nFollow the format: <strong>/price PAIR (/price BTCUSDT)</strong>"
  );

  getPrice();
});

// Action to get Wallet Balances
bot.command("get_wallet_balances", async (ctx) => {
  try {
    const res = await axios.get(`${baseAPIURL}/get-wallet-balance`);

    const balances = res.data.data;

    let message = `<strong>Wallet Balances</strong>`;
    message += `\nETH: <strong>${balances.ETH}</strong>`;
    message += `\nUSDT: <strong>${balances.USDT}</strong>`;
    message += `\nBTC: <strong>${balances.BTC}</strong>`;

    ctx.replyWithHTML(message);
  } catch (error) {
    console.error(error);
    ctx.reply(`Something went wrong, try again...`);
  }
});

// Action to get orders
bot.command("get_orders", async (ctx) => {
  ctx.replyWithHTML(
    "To get your orders, reply with the pair you would like to fetch the orders for. \nFollow the format: <strong>/orders PAIR (/orders BTCUSDT)</strong>"
  );

  getOrders();
});

// Action to cancel orders
bot.command("cancel_orders", async (ctx) => {
  ctx.replyWithHTML(
    "To cancel orders, reply with the pair you would like to cancel orders for. \nFollow the format: <strong>/cancel PAIR (/cancel BTCUSDT)</strong>"
  );

  cancelOrders();
});

export { bot };
