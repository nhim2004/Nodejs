import express from 'express';
import { calculateShipping } from '../controllers/paymentController.js';

const router = express.Router();

/**
 * Routes liên quan tới các nghiệp vụ thanh toán chung
 * - Ví dụ: tính phí vận chuyển hoặc các hàm tiện ích liên quan đến payment
 */
// POST /api/payment/shipping -> Tính phí vận chuyển (nhận địa chỉ/giỏ hàng và trả phí)
router.post('/shipping', calculateShipping);

export default router;