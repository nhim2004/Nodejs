import express from "express";
import { 
    getOrders,
    createOrder,
    getOrderById,
    getMyOrders,
    updateOrderStatus,
    updateOrderToPaid,
    deleteOrder
} from "../controllers/orderController.js";
import { protect, admin } from '../middleware/auth.js';
import { 
  orderValidation, 
  idValidation,
  paginationValidation
} from '../middleware/validators.js';
import { orderLimiter } from '../middleware/rateLimiter.js';


const router = express.Router();

/**
 * IMPORTANT: Routes are matched in order from top to bottom.
 * Specific routes (e.g., /myorders) must come BEFORE dynamic routes (e.g., /:id)
 */

// ==================== USER ROUTES ====================

// Create a new order (protected, with rate limiter and validation)
router.post("/", protect, orderLimiter, orderValidation, createOrder);

// Get orders for the currently authenticated user (paginated)
// MUST come before /:id route to avoid "myorders" being treated as an ID
router.get("/myorders", protect, paginationValidation, getMyOrders);

// Mark an order as paid (protected)
// Specific route before /:id
router.put("/:id/pay", protect, idValidation, updateOrderToPaid);

// ==================== ADMIN ROUTES ====================

// List all orders (admin only, paginated)
// Query param based, so doesn't conflict with /:id
router.get("/", protect, admin, paginationValidation, getOrders);

// Update order status (admin action)
// Specific path /:id/status before generic /:id
router.put("/:id/status", protect, admin, idValidation, updateOrderStatus);

// Delete an order (admin action)
router.delete("/:id", protect, admin, idValidation, deleteOrder);

// ==================== DYNAMIC ROUTES (LAST) ====================

// Get order details by ID (protected)
// MUST be last among GET routes to avoid catching specific paths
router.get("/:id", protect, idValidation, getOrderById);

export default router;
