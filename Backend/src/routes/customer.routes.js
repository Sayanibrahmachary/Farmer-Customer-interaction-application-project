import { Router } from "express";

import { registerCustomer,logInCustomer,logOutCustomer,changePasswordCustomer,allProductsAccordingToAddress, refreshAccessToken,todaysAllOrder} from "../controllers/customer.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";
import {verifyJWTCustomer} from "../middlewares/authCustomer.middlewares.js";

const router=Router();

router.route("/registerCustomer").post(
    upload.none(),registerCustomer
)
router.route("/loginCustomer").post(logInCustomer);
router.route("/logOutCustomer").post(verifyJWTCustomer,logOutCustomer);
router.route("/changePasswordCustomer").post(verifyJWTCustomer,changePasswordCustomer);
router.route("/allProductsAccordingToAddress/:customerId").get(verifyJWTCustomer,allProductsAccordingToAddress);
router.route("/refreshTokenCustomer").post(refreshAccessToken);
router.route("/todaysAllOrder/:customerId").post(verifyJWTCustomer,todaysAllOrder);
export default router