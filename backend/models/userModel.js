import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Add indexes
// Note: email already has unique index, no need to add again
userSchema.index({ isAdmin: 1 }); // Filter admins
userSchema.index({ createdAt: -1 }); // Sort by registration date

const User = mongoose.model("User", userSchema);
export default User;
