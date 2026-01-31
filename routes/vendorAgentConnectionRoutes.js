import express from "express"
import { acceptConnectionRequest, rejectConnectionRequest,createConnectionRequest, viewConnectedAgents, viewConnectedVendors, findAgentByID, viewConnectionRequests, deleteConnection } from "../controllers/vendorAgentConnectionController.js";
import { vendorAuthMiddleware } from "../middleware/vendorAuthMiddleware.js";
import { agentAuthMiddleware } from "../middleware/agentAuthMiddleware.js";

const router = express.Router();

router.post("/:agentID",vendorAuthMiddleware,createConnectionRequest);
router.put("/accept/:connectionId",agentAuthMiddleware, acceptConnectionRequest);
router.put("/reject/:connectionId",agentAuthMiddleware, rejectConnectionRequest);
router.get("/connectedAgents",vendorAuthMiddleware, viewConnectedAgents);
router.get("/connectedVendors",agentAuthMiddleware, viewConnectedVendors);
router.get("/findAgentByID/:id", vendorAuthMiddleware, findAgentByID);
router.get("/connectionRequests",agentAuthMiddleware, viewConnectionRequests);
router.delete("/:connectionId",vendorAuthMiddleware, deleteConnection);

export default router;