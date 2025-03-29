import { createProduct ,updateProduct, ManuallydeleteProduct, allComments} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/authFarmer.middlewares.js";

const router=Router();

router.route("/createProduct").post(verifyJWT,
    upload.fields([
        {
            name:"photo",
            maxCount:1,
        }
    ]),createProduct
)

router.route("/updateProduct/:productId").patch(updateProduct)
router.route("/deleteProduct/:productId").delete(ManuallydeleteProduct)
router.route("/allComments/:productId").post(allComments)
export default router