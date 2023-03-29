import "dotenv/config";

export const CONFIG = {
  PORT: process.env.PORT || '',
  API_KEY: process.env.API_KEY || '',
  API_SECREY: process.env.API_SECRET || '',
};
