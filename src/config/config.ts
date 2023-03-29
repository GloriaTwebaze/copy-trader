import "dotenv/config";

export const CONFIG = {
  PORT: process.env.PORT || '',
  API_KEY: process.env.API_KEY || '',
  API_SECRET: process.env.API_SECRET || '',
};
