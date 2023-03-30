import { Router } from "express";
import { getPrice, getWalletBalances, placeOrder } from "../controllers/bybitController";

const router = Router();

router.post("/place-order", placeOrder);
router.get("/get-price", getPrice);
router.get("/get-wallet-balance", getWalletBalances);

export default router;
