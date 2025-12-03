import express from 'express';
import { getOrderStats } from '../controllers/statsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * Routes thống kê (statistics) dành cho Admin
 * - Ví dụ: thống kê đơn hàng, doanh thu, các chỉ số kinh doanh
 */
// GET /api/stats/orders -> Lấy thống kê liên quan tới đơn hàng (Admin)
router.get('/orders', protect, admin, getOrderStats);

export default router;