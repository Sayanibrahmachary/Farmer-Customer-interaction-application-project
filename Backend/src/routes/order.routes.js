import { Router } from "express";
import { orderPlaced,cancelOrder } from "../controllers/order.controller.js";

const router=Router();

router.route("/orderPlaced/:customerId/:productId").post(orderPlaced);
router.route("/cancelOrder/:orderId").delete(cancelOrder);

export default router