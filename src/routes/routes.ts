import { Router } from "express";
import {
  cancelOrder,
  getOrders,
  getPrice,
  getWalletBalances,
  placeOrder,
} from "../controllers/bybitController";

const router = Router();

router.post("/place-order", placeOrder);
router.get("/get-price", getPrice);
router.get("/get-wallet-balance", getWalletBalances);
router.get("/get-orders", getOrders);
router.get("/cancel-order", cancelOrder);

export default router;
