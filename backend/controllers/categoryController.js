import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

// @desc    Lấy tất cả danh mục
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res) => {
  try {
    const { isActive } = req.query;
    
    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const categories = await Category.find(query)
      .sort({ displayOrder: 1, createdAt: -1 });

    // Tính số sản phẩm trong mỗi danh mục
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category.name
        });
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh mục: " + error.message
    });
  }
};

// @desc    Lấy danh mục theo ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại"
      });
    }

    // Lấy danh sách sản phẩm trong danh mục
    const products = await Product.find({
      category: category.name
    }).select("_id name price image");

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        products,
        productCount: products.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh mục: " + error.message
    });
  }
};

// @desc    Tạo danh mục mới
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, image, displayOrder } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tên danh mục"
      });
    }

    // Kiểm tra tên danh mục đã tồn tại
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục đã tồn tại"
      });
    }

    const category = new Category({
      name,
      description: description || "",
      icon: icon || "📦",
      image: image || null,
      displayOrder: displayOrder || 0
    });

    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: "Danh mục tạo thành công",
      data: savedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo danh mục: " + error.message
    });
  }
};

// @desc    Cập nhật danh mục
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const { name, description, icon, image, displayOrder, isActive } = req.body;
    const categoryId = req.params.id;

    // Kiểm tra danh mục tồn tại
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại"
      });
    }

    // Nếu cập nhật tên, kiểm tra tên mới có bị trùng không
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name,
        _id: { $ne: categoryId }
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Tên danh mục đã tồn tại"
        });
      }

      // Cập nhật tên category cho tất cả sản phẩm
      if (category.name) {
        await Product.updateMany(
          { category: category.name },
          { category: name }
        );
      }
    }

    // Cập nhật danh mục
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (icon) updateData.icon = icon;
    if (image !== undefined) updateData.image = image;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Danh mục cập nhật thành công",
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật danh mục: " + error.message
    });
  }
};

// @desc    Xóa danh mục
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Danh mục không tồn tại"
      });
    }

    // Kiểm tra xem có sản phẩm nào trong danh mục không
    const productCount = await Product.countDocuments({
      category: category.name
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa danh mục. Danh mục này có ${productCount} sản phẩm. Vui lòng xóa hoặc chuyển các sản phẩm trước.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Danh mục xóa thành công"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa danh mục: " + error.message
    });
  }
};

// @desc    Lấy thống kê danh mục
// @route   GET /api/categories/stats/overview
// @access  Private/Admin
export const getCategoryStats = async (req, res) => {
  try {
    const categories = await Category.find();
    
    const stats = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category.name
        });
        const totalPrice = await Product.aggregate([
          { $match: { category: category.name } },
          { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        return {
          categoryId: category._id,
          categoryName: category.name,
          productCount,
          totalValue: totalPrice[0]?.total || 0
        };
      })
    );

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thống kê: " + error.message
    });
  }
};
