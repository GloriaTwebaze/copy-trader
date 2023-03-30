import "dotenv/config";

export const CONFIG = {
  PORT: process.env.PORT || "",
  API_KEY: process.env.API_KEY || "",
  API_SECRET: process.env.API_SECRET || "",
  TOKEN: process.env.TOKEN || "",
  BASE_URL: process.env.BASE_URL || "",
  // Local API used in bot.
  BASE_API_URL: process.env.BASE_API_URL || "",
};
