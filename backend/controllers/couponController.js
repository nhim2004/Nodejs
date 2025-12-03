import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import User from '../models/userModel.js';

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons/admin
// @access  Private/Admin
export const getAllCouponsAdmin = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách coupon: ' + error.message
    });
  }
};

// @desc    Get active coupons (User)
// @route   GET /api/coupons
// @access  Public
export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).select('-usedBy').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách coupon: ' + error.message
    });
  }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      usagePerUser,
      startDate,
      endDate,
      applicableCategories,
      applicableProducts,
      notifyAllUsers
    } = req.body;

    // Validate
    if (!code || !description || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Check if coupon code exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Mã coupon đã tồn tại'
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscountAmount,
      usageLimit,
      usagePerUser: usagePerUser || 1,
      startDate,
      endDate,
      applicableCategories: applicableCategories || [],
      applicableProducts: applicableProducts || []
    });

    // Send notification to all users if requested
    if (notifyAllUsers) {
      const users = await User.find({ isActive: true }).select('_id');
      const notifications = users.map(user => ({
        recipient: user._id,
        type: 'coupon',
        title: '🎉 Coupon mới dành cho bạn!',
        message: `${description}. Sử dụng mã: ${code.toUpperCase()}`,
        data: {
          couponCode: code.toUpperCase(),
          couponId: coupon._id
        }
      }));

      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: 'Tạo coupon thành công',
      data: coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo coupon: ' + error.message
    });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon không tồn tại'
      });
    }

    // Update fields
    const allowedUpdates = [
      'description', 'discountType', 'discountValue', 'minOrderAmount',
      'maxDiscountAmount', 'usageLimit', 'usagePerUser', 'startDate',
      'endDate', 'isActive', 'applicableCategories', 'applicableProducts'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        coupon[field] = req.body[field];
      }
    });

    await coupon.save();

    res.json({
      success: true,
      message: 'Cập nhật coupon thành công',
      data: coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật coupon: ' + error.message
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon không tồn tại'
      });
    }

    await coupon.deleteOne();

    res.json({
      success: true,
      message: 'Xóa coupon thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa coupon: ' + error.message
    });
  }
};

// @desc    Validate and apply coupon
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount, cartItems } = req.body;
    const userId = req.user._id;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Mã coupon không tồn tại'
      });
    }

    // Check if active
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Mã coupon không còn hiệu lực'
      });
    }

    // Check dates
    const now = new Date();
    if (coupon.startDate > now || coupon.endDate < now) {
      return res.status(400).json({
        success: false,
        message: 'Mã coupon đã hết hạn hoặc chưa có hiệu lực'
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Mã coupon đã hết lượt sử dụng'
      });
    }

    // Check usage per user
    const userUsage = coupon.usedBy.filter(u => u.user.toString() === userId.toString()).length;
    if (userUsage >= coupon.usagePerUser) {
      return res.status(400).json({
        success: false,
        message: `Bạn đã sử dụng mã này ${coupon.usagePerUser} lần`
      });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu ${coupon.minOrderAmount.toLocaleString('vi-VN')}đ`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      success: true,
      message: 'Áp dụng mã thành công',
      data: {
        couponId: coupon._id,
        code: coupon.code,
        discountAmount: Math.round(discountAmount),
        finalAmount: Math.round(orderAmount - discountAmount)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra coupon: ' + error.message
    });
  }
};

// @desc    Get coupon stats
// @route   GET /api/coupons/stats
// @access  Private/Admin
export const getCouponStats = async (req, res) => {
  try {
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ isActive: true });
    const expiredCoupons = await Coupon.countDocuments({ endDate: { $lt: new Date() } });
    
    const topUsedCoupons = await Coupon.find()
      .sort({ usageCount: -1 })
      .limit(5)
      .select('code description usageCount usageLimit');

    res.json({
      success: true,
      data: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        topUsedCoupons
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê: ' + error.message
    });
  }
};
