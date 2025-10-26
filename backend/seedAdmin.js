// seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";
import connectDB from "./config/db.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const plainPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const name = process.env.ADMIN_NAME || "Admin";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists:", email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(plainPassword, 10);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      isAdmin: true,
    });

    console.log("✅ Admin created:", { id: admin._id, email: admin.email });
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
