import mongoose from 'mongoose';

const inventoryTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['import', 'export', 'adjustment', 'return'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  note: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: 0
    },
    minStockLevel: {
      type: Number,
      default: 10
    },
    maxStockLevel: {
      type: Number,
      default: 1000
    },
    location: {
      warehouse: String,
      shelf: String,
      bin: String
    },
    lastRestocked: Date,
    transactions: [inventoryTransactionSchema]
  },
  {
    timestamps: true
  }
);

// Virtual for available stock
inventorySchema.virtual('availableStock').get(function() {
  return this.currentStock - this.reservedStock;
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.currentStock <= 0) return 'out_of_stock';
  if (this.currentStock <= this.minStockLevel) return 'low_stock';
  if (this.currentStock >= this.maxStockLevel) return 'overstock';
  return 'in_stock';
});

// Index
inventorySchema.index({ product: 1 }, { unique: true });
inventorySchema.index({ currentStock: 1 });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
