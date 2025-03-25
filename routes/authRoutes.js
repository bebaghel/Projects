import express from "express";
import { registerUser, loginUser, dashboard } from "../controller/authController.js";
import { body } from "express-validator";
import {authMiddleware} from '../middleware/authMiddleware.js'

const router = express.Router();

router.post("/register", [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
], registerUser);

router.post("/login", loginUser);

router.get("/dashboard", authMiddleware, dashboard);

export default router;
