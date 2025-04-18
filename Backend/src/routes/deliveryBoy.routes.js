import { Router } from "express";
import { registerDeliveryBoy,logInDeliveryBoy,logOutDeliveryBoy,changePasswordDeliveryBoy ,refreshAccessToken, useingPinCheckUser,bookDeliveryBoy,todaysAllOrder} from "../controllers/deliverBoy.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";
import {verifyJWTDeliveryBoy} from "../middlewares/authDeliveryBoy.middlewares.js";

const router=Router();

router.route("/registerDeliveryBoy").post(
    upload.none(),registerDeliveryBoy
)
router.route("/loginDeliveryBoy").post(logInDeliveryBoy);
router.route("/logOutDeliveryBoy").post(verifyJWTDeliveryBoy,logOutDeliveryBoy);
router.route("/changePasswordDeliveryBoy").post(verifyJWTDeliveryBoy,changePasswordDeliveryBoy);
router.route("/refreshTokenDeliveryBoy").post(refreshAccessToken);
router.route("/validCustomer/:deliveryBoyId/:pinByParams").post(useingPinCheckUser);
router.route("/bookDeliveryBoy/:customerId/:orderId").post(bookDeliveryBoy);
router.route("/todaysAllOrder/:deliveryBoyId").post(todaysAllOrder);

export default router
