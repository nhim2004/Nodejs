import { body, param, query, validationResult } from 'express-validator';

// Middleware để check validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Log validation errors for easier debugging
    console.error('Validation failed for', req.path, errors.array());
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

// Product validation rules
export const productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 200 }).withMessage('Name must be 3-200 characters')
    .escape(),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description too long')
    .escape(),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .escape(),
  body('parentCategory')
    .trim()
    .notEmpty().withMessage('Parent category is required')
    .escape(),
  body('countInStock')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('image')
    .optional()
    .trim()
    .isURL().withMessage('Image must be a valid URL'),
  validate
];

// User registration validation
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and number'),
  validate
];

// Login validation
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

// User update validation
export const userUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('isAdmin')
    .optional()
    .isBoolean().withMessage('isAdmin must be boolean'),
  validate
];

// Order validation
export const orderValidation = [
  body('orderItems')
    .isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('orderItems.*.product')
    .isMongoId().withMessage('Invalid product ID'),
  body('orderItems.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street')
    .trim()
    .notEmpty().withMessage('Street is required')
    .escape(),
  body('shippingAddress.province')
    .trim()
    .notEmpty().withMessage('Province is required')
    .escape(),
  body('shippingAddress.district')
    .trim()
    .notEmpty().withMessage('District is required')
    .escape(),
  body('paymentMethod')
    .trim()
    .notEmpty().withMessage('Payment method is required')
    .isIn(['COD', 'Banking', 'BANK_TRANSFER']).withMessage('Invalid payment method'),
  validate
];

// Category validation
export const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),
  body('parentCategory')
    .optional()
    .trim()
    .escape(),
  validate
];

// ID parameter validation
export const idValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  validate
];

// Sanitize route param `id` by removing accidental suffixes like ":1" which
// sometimes appear when the browser or client appends a line/column marker.
// This middleware should run before `idValidation` when used.
export const sanitizeParamId = (req, res, next) => {
  try {
    if (req.params && req.params.id && typeof req.params.id === 'string') {
      const idx = req.params.id.indexOf(':');
      if (idx > -1) {
        req.params.id = req.params.id.substring(0, idx);
      }
    }
  } catch (err) {
    // ignore and continue
  }
  next();
};

// Pagination query validation
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Limit must be 1-1000'),
  validate
];

// Review validation
export const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 10, max: 500 }).withMessage('Comment must be 10-500 characters')
    .escape(),
  validate
];
