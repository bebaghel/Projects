import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controller/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getUsers); // Admin only
router.get("/:id", protect, getUserById); // Any authenticated user
router.post("/", protect, adminOnly, createUser); // Admin only
router.put("/:id", protect, updateUser); // Any authenticated user
router.delete("/:id", protect, adminOnly, deleteUser); // Admin only

export default router;
