import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

/**
 * Routes quản lý danh mục sản phẩm (category)
 * - Public: lấy danh mục hoặc lấy chi tiết
 * - Admin: tạo, cập nhật, xóa và lấy thống kê
 */
// GET /api/categories            -> Lấy tất cả danh mục
router.get("/", getAllCategories);

// GET /api/categories/:id        -> Lấy danh mục theo ID
router.get("/:id", getCategoryById);

// POST /api/categories           -> Tạo danh mục mới (Admin)
router.post("/", protect, admin, createCategory);

// PUT /api/categories/:id        -> Cập nhật danh mục (Admin)
router.put("/:id", protect, admin, updateCategory);

// DELETE /api/categories/:id     -> Xóa danh mục (Admin)
router.delete("/:id", protect, admin, deleteCategory);

// GET /api/categories/stats/overview -> Thống kê danh mục (Admin)
router.get("/stats/overview", protect, admin, getCategoryStats);

export default router;
