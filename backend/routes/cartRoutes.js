import express from "express";
import {getCart,removeItemFromCart,updateCart,clearUserCart} from "../controllers/cartController.js"
import {verifyToken} from "../middleware/verifyToken.js"
import { mergeGuestCart } from "../controllers/cartController.js";

const router=express.Router();



router.get("/",verifyToken,getCart);
router.post("/",updateCart);
router.delete("/:productId",verifyToken,removeItemFromCart);
router.delete("/",verifyToken,clearUserCart)

router.post("/merge-guest-cart", verifyToken, mergeGuestCart);

export default router;