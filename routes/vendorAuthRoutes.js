import express from "express";
import { login, signup } from "../controllers/vendorAuthController.js";
import { loginValidation, signupValidation } from "../middleware/vendorAuthValidation.js";

const router = express.Router();

router.post("/signup", signupValidation,signup);
router.post("/login", loginValidation, login);

export default router;