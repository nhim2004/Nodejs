import express from "express";
import { loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

/**
 * Routes dành cho Admin
 * Mục đích: chứa các endpoint liên quan tới quản trị viên (ví dụ: đăng nhập admin, quản lý admin...)
 * Hiện tại chỉ có:
 *  - POST /login: đăng nhập tài khoản admin
 */
// POST /api/admin/login -> Đăng nhập admin
router.post("/login", loginAdmin);

export default router;
