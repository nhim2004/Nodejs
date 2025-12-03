import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import { protect, admin } from '../middleware/auth.js';
import { 
  registerValidation, 
  loginValidation, 
  userUpdateValidation,
  idValidation,
  paginationValidation
} from '../middleware/validators.js';
import { authLimiter, createAccountLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * Routes quản lý người dùng (user)
 * - Public: đăng ký, đăng nhập (có rate limiting)
 * - Private: profile (thông tin người dùng, cập nhật)
 * - Admin: quản lý user (list, chi tiết, cập nhật, xóa)
 */
// POST /api/users/register -> Đăng ký tài khoản (có rate limit)
router.post("/register", createAccountLimiter, registerValidation, registerUser);

// POST /api/users/login    -> Đăng nhập (có rate limit)
router.post("/login", authLimiter, loginValidation, loginUser);

// GET /api/users/profile  -> Lấy profile của user hiện tại (protected)
router.get("/profile", protect, getUserProfile);

// PUT /api/users/profile  -> Cập nhật profile của user hiện tại (protected)
router.put("/profile", protect, userUpdateValidation, updateUserProfile);

// GET /api/users          -> Lấy danh sách user (Admin, paginated)
router.get("/", protect, admin, paginationValidation, getAllUsers);

// GET /api/users/:id      -> Lấy thông tin user theo ID (Admin)
router.get("/:id", protect, admin, idValidation, getUserById);

// PUT /api/users/:id      -> Cập nhật user (Admin)
router.put("/:id", protect, admin, idValidation, userUpdateValidation, updateUser);

// DELETE /api/users/:id   -> Xóa user (Admin)
router.delete("/:id", protect, admin, idValidation, deleteUser);

export default router;
