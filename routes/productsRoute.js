import express from "express";
import { vendorAuthMiddleware } from "../middleware/vendorAuthMiddleware.js";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productsController.js";

const router = express.Router();

router.get("/",vendorAuthMiddleware, getAllProducts);
router.get("/:id",vendorAuthMiddleware, getProductById);
router.post("/",vendorAuthMiddleware, createProduct);
router.put("/:id",vendorAuthMiddleware, updateProduct);
router.delete("/:id",vendorAuthMiddleware, deleteProduct);

export default router;