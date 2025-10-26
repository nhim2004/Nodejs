import express from "express";
import { getOrders, createOrder } from "../controllers/orderController.js";

const router = express.Router();

// Lấy danh sách đơn hàng
router.get("/", getOrders);

// Tạo đơn hàng mới
router.post("/", createOrder);

export default router;
