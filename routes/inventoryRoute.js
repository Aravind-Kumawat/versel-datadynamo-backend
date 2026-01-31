import express from "express";
const router = express.Router();
import { getRecommendedOrders } from "../controllers/inventoryController.js";

// This route will be: GET /api/inventory/recommendations/:vendorId
router.get("/recommendations/:vendorId", getRecommendedOrders);

export default router;