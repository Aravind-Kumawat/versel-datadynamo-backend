import express from "express";
import { login, signup } from "../controllers/agentAuthController.js";
import { loginValidation, signupValidation } from "../middleware/agentAuthValidation.js";

const router = express.Router();

router.post("/signup", signupValidation,signup);
router.post("/login", loginValidation, login);

export default router;