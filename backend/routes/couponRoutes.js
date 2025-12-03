import express from 'express';
import {
  getAllCouponsAdmin,
  getActiveCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getCouponStats
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', protect, admin, getAllCouponsAdmin);
router.get('/stats', protect, admin, getCouponStats);
router.get('/', getActiveCoupons);
router.post('/', protect, admin, createCoupon);
router.post('/validate', protect, validateCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;
