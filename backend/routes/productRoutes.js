import express from "express";
import { 
    getProducts, 
    getProductById,
    getProductsByCategory, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteProductReview
} from "../controllers/productController.js";
import { protect, admin } from '../middleware/auth.js';
import { 
  productValidation, 
  idValidation, 
  paginationValidation,
  reviewValidation
} from '../middleware/validators.js';
import { sanitizeParamId } from '../middleware/validators.js';

const router = express.Router();

/**
 * Routes quản lý sản phẩm (product)
 * - Public: lấy danh sách / chi tiết / lấy theo danh mục
 * - Protected/Admin: tạo, cập nhật, xóa sản phẩm
 * - Review: thêm/đọc/xóa đánh giá sản phẩm
 */
// GET /api/products                  -> Lấy danh sách sản phẩm (có pagination)
router.get("/", paginationValidation, getProducts); 

// GET /api/products/category/:category -> Lấy sản phẩm theo danh mục
router.get("/category/:category", getProductsByCategory);

// GET /api/products/:id             -> Lấy chi tiết sản phẩm theo ID
// Lưu ý: sanitizeParamId dùng để dọn các suffix vô tình (vd ":1") trước khi validate
router.get("/:id", sanitizeParamId, idValidation, getProductById);

// POST /api/products                -> Thêm sản phẩm mới (Admin/protected)
router.post("/", protect, productValidation, createProduct);

// PUT /api/products/:id             -> Cập nhật sản phẩm (Admin/protected)
router.put("/:id", protect, sanitizeParamId, idValidation, productValidation, updateProduct);

// DELETE /api/products/:id          -> Xóa sản phẩm (Admin/protected)
router.delete("/:id", protect, sanitizeParamId, idValidation, deleteProduct);

// POST /api/products/:id/reviews    -> Thêm review cho sản phẩm (user phải đăng nhập)
router.post("/:id/reviews", protect, sanitizeParamId, idValidation, reviewValidation, createProductReview);

// GET /api/products/:id/reviews     -> Lấy danh sách review cho sản phẩm
router.get("/:id/reviews", sanitizeParamId, idValidation, getProductReviews);

// DELETE /api/products/:id/reviews/:reviewId -> Xóa review (protected)
router.delete("/:id/reviews/:reviewId", protect, sanitizeParamId, idValidation, deleteProductReview);

export default router;
