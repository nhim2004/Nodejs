import Inventory from '../models/Inventory.js';
import Product from '../models/productModel.js';

// @desc    Get all inventory
// @route   GET /api/inventory
// @access  Private/Admin
export const getAllInventory = async (req, res) => {
  try {
    const { status } = req.query;
    
    const inventory = await Inventory.find()
      .populate('product', 'name image price category')
      .sort({ currentStock: 1 });

    let filteredInventory = inventory;

    if (status === 'low_stock') {
      filteredInventory = inventory.filter(item => 
        item.currentStock > 0 && item.currentStock <= item.minStockLevel
      );
    } else if (status === 'out_of_stock') {
      filteredInventory = inventory.filter(item => item.currentStock === 0);
    } else if (status === 'overstock') {
      filteredInventory = inventory.filter(item => item.currentStock >= item.maxStockLevel);
    }

    res.json({
      success: true,
      count: filteredInventory.length,
      data: filteredInventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tồn kho: ' + error.message
    });
  }
};

// @desc    Get inventory by product
// @route   GET /api/inventory/product/:productId
// @access  Private/Admin
export const getInventoryByProduct = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ product: req.params.productId })
      .populate('product')
      .populate('transactions.performedBy', 'username');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin tồn kho'
      });
    }

    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin tồn kho: ' + error.message
    });
  }
};

// @desc    Create or update inventory
// @route   POST /api/inventory
// @access  Private/Admin
export const createOrUpdateInventory = async (req, res) => {
  try {
    const {
      productId,
      currentStock,
      minStockLevel,
      maxStockLevel,
      location
    } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại'
      });
    }

    let inventory = await Inventory.findOne({ product: productId });

    if (inventory) {
      // Update existing
      if (currentStock !== undefined) inventory.currentStock = currentStock;
      if (minStockLevel !== undefined) inventory.minStockLevel = minStockLevel;
      if (maxStockLevel !== undefined) inventory.maxStockLevel = maxStockLevel;
      if (location) inventory.location = location;

      await inventory.save();
    } else {
      // Create new
      inventory = await Inventory.create({
        product: productId,
        currentStock: currentStock || 0,
        minStockLevel: minStockLevel || 10,
        maxStockLevel: maxStockLevel || 1000,
        location: location || {}
      });
    }

    // Update product countInStock
    product.countInStock = inventory.currentStock;
    await product.save();

    await inventory.populate('product');

    res.json({
      success: true,
      message: inventory ? 'Cập nhật tồn kho thành công' : 'Tạo tồn kho thành công',
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật tồn kho: ' + error.message
    });
  }
};

// @desc    Add stock transaction (import/export/adjustment)
// @route   POST /api/inventory/transaction
// @access  Private/Admin
export const addStockTransaction = async (req, res) => {
  try {
    const {
      productId,
      type,
      quantity,
      reason,
      note
    } = req.body;

    if (!productId || !type || !quantity || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    let inventory = await Inventory.findOne({ product: productId });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin tồn kho'
      });
    }

    // Calculate new stock
    let newStock = inventory.currentStock;
    if (type === 'import' || type === 'return') {
      newStock += quantity;
    } else if (type === 'export' || type === 'adjustment') {
      newStock -= quantity;
      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng xuất vượt quá tồn kho'
        });
      }
    }

    // Add transaction
    inventory.transactions.push({
      type,
      quantity,
      reason,
      note,
      performedBy: req.user._id
    });

    inventory.currentStock = newStock;
    if (type === 'import') {
      inventory.lastRestocked = new Date();
    }

    await inventory.save();

    // Update product countInStock
    const product = await Product.findById(productId);
    if (product) {
      product.countInStock = newStock;
      await product.save();
    }

    await inventory.populate('product');

    res.json({
      success: true,
      message: 'Ghi nhận giao dịch thành công',
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi ghi nhận giao dịch: ' + error.message
    });
  }
};

// @desc    Get inventory stats
// @route   GET /api/inventory/stats
// @access  Private/Admin
export const getInventoryStats = async (req, res) => {
  try {
    const allInventory = await Inventory.find().populate('product', 'price');

    const totalProducts = allInventory.length;
    const lowStockProducts = allInventory.filter(item => 
      item.currentStock > 0 && item.currentStock <= item.minStockLevel
    ).length;
    const outOfStockProducts = allInventory.filter(item => item.currentStock === 0).length;
    const overstockProducts = allInventory.filter(item => item.currentStock >= item.maxStockLevel).length;

    const totalStockValue = allInventory.reduce((sum, item) => {
      return sum + (item.currentStock * (item.product?.price || 0));
    }, 0);

    const totalItems = allInventory.reduce((sum, item) => sum + item.currentStock, 0);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        overstockProducts,
        totalStockValue,
        totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê: ' + error.message
    });
  }
};

// @desc    Get low stock alerts
// @route   GET /api/inventory/alerts
// @access  Private/Admin
export const getLowStockAlerts = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate('product', 'name image category');

    const alerts = inventory.filter(item => 
      item.currentStock <= item.minStockLevel
    ).sort((a, b) => a.currentStock - b.currentStock);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cảnh báo: ' + error.message
    });
  }
};
