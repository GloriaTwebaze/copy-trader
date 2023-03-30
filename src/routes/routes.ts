import { Router } from "express";
import { getPrice, placeOrder } from "../controllers/bybitController";

const router = Router();

router.post("/place-order", placeOrder);
router.get("/get-price", getPrice);

export default router;
