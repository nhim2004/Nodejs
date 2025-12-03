import express from 'express';
import {
  getAllInventory,
  getInventoryByProduct,
  createOrUpdateInventory,
  addStockTransaction,
  getInventoryStats,
  getLowStockAlerts
} from '../controllers/inventoryController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, admin, getAllInventory);
router.get('/stats', protect, admin, getInventoryStats);
router.get('/alerts', protect, admin, getLowStockAlerts);
router.get('/product/:productId', protect, admin, getInventoryByProduct);
router.post('/', protect, admin, createOrUpdateInventory);
router.post('/transaction', protect, admin, addStockTransaction);

export default router;
