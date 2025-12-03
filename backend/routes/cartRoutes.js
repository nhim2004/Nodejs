import express from 'express';
import { getCart, setCart, upsertItem, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * Routes quản lý giỏ hàng của người dùng
 * - Yêu cầu user đã đăng nhập (protected)
 * - Chức năng: lấy giỏ, cập nhật toàn bộ giỏ, thêm/sửa 1 mục, xoá giỏ
 */
// GET  /api/cart       -> Lấy giỏ hàng của user hiện tại
router.get('/', protect, getCart);

// POST /api/cart       -> Thay thế toàn bộ giỏ hàng (gửi array items)
router.post('/', protect, setCart);

// PUT  /api/cart/item  -> Thêm hoặc cập nhật 1 mục trong giỏ
router.put('/item', protect, upsertItem);

// DELETE /api/cart     -> Xoá toàn bộ giỏ hàng của user
router.delete('/', protect, clearCart);

export default router;
