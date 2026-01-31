import express from "express";
import { createOrder, viewVendorOrders, viewAgentOrders, updateOrderStatus, findOrderByProductId, deleteOrder } from "../controllers/ordersController.js";
import { vendorAuthMiddleware } from "../middleware/vendorAuthMiddleware.js";
import { agentAuthMiddleware } from "../middleware/agentAuthMiddleware.js";


const router = express.Router();

router.post("/",vendorAuthMiddleware,createOrder);
router.get("/vendorOrders", vendorAuthMiddleware, viewVendorOrders)
router.get("/agentOrders",agentAuthMiddleware, viewAgentOrders);
router.put("/:id/:status", agentAuthMiddleware, updateOrderStatus);
router.get("/:id",vendorAuthMiddleware,findOrderByProductId);
router.delete("/:id",vendorAuthMiddleware, deleteOrder);
export default router