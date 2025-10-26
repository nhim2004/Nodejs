import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./backend/config/db.js";
import Admin from "./backend/models/Admin.js";

dotenv.config();
connectDB();

const createAdmin = async () => {
    try {
        const email = "admin@example.com";
        const password = "123456"; // bạn có thể đổi mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            console.log("Admin đã tồn tại!");
            process.exit();
        }

        const admin = await Admin.create({
            email,
            password: hashedPassword,
            name: "Super Admin"
        });

        console.log("Admin đã được tạo:", admin);
        process.exit();
    } catch (error) {
        console.error("Lỗi tạo admin:", error);
        process.exit(1);
    }
};

createAdmin();
