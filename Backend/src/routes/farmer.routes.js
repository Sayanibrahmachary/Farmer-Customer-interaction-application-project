import {registerFarmer,logInFarmer,logOutFarmer,changePasswordFarmer,refreshAccessToken} from "../controllers/farmer.controller.js";
import {upload} from "../middlewares/multer.middlewares.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/authFarmer.middlewares.js";
import { todaysAllProduct} from "../controllers/farmer.controller.js";

const router=Router();

router.route("/registerFarmer").post(upload.none(),registerFarmer);
router.route("/loginFarmer").post(logInFarmer);
router.route("/logoutFarmer").post(verifyJWT,logOutFarmer);
router.route("/changePasswordFarmer").post(verifyJWT,changePasswordFarmer);
router.route("/refreshTokenFarmer").post(refreshAccessToken);
router.route("/todaysAllProduct/:farmerId").post(todaysAllProduct);
export default router