import { Router } from "express";
import { orderPlaced,cancelOrder } from "../controllers/order.controller.js";

const router=Router();

router.route("/orderPlaced/:customerId/:productId").post(orderPlaced);

export default router