import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên danh mục"],
      unique: [true, "Tên danh mục đã tồn tại"],
      trim: true,
      minlength: [3, "Tên danh mục phải ít nhất 3 ký tự"],
      maxlength: [50, "Tên danh mục không được quá 50 ký tự"]
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Mô tả không được quá 500 ký tự"]
    },
    icon: {
      type: String,
      default: "📦", // Font Awesome icon name hoặc emoji
    },
    image: {
      type: String,
      default: null,
    },
    displayOrder: {
      type: Number,
      default: 0, // Để sắp xếp hiển thị trên giao diện
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    productCount: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

// Note: name already has unique constraint, which creates an index automatically
// No need to add duplicate index

const Category = mongoose.model("Category", categorySchema);
export default Category;
