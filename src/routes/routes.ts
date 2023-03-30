import { Router } from "express";
import { placeOrder } from "../controllers/bybitController";

const router = Router();

router.post("/place-order", placeOrder);

export default router;
