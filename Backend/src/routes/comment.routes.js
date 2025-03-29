import { createComment,updateComment,deleteComment } from "../controllers/comment.controllers.js";
import { Router } from "express";
import {verifyJWTCustomer} from "../middlewares/authCustomer.middlewares.js";

const router=Router();
router.route("/createComment/:productId").post(verifyJWTCustomer,createComment);
router.route("/updateComment/:commentId").post(verifyJWTCustomer,updateComment);
router.route("/deletedComment/:commentId").delete(verifyJWTCustomer,deleteComment)
export default router