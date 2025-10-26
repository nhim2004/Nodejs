import express from "express";
import { 
    getProducts, 
    getProductById,
    getProductsByCategory, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../controllers/productController.js";
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Lấy tất cả sản phẩm
router.get("/", getProducts);

// Lấy sản phẩm theo danh mục
router.get("/category/:category", getProductsByCategory);

// Lấy sản phẩm theo ID
router.get("/:id", getProductById);

// Thêm sản phẩm mới
router.post("/", protect, createProduct);

// Cập nhật sản phẩm
router.put("/:id", protect, updateProduct);

// Xóa sản phẩm
router.delete("/:id", protect, deleteProduct);

export default router;
