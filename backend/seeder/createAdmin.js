import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Kiểm tra xem admin đã tồn tại chưa
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (adminExists) {
      console.log('Admin account already exists');
      process.exit();
    }

    // Tạo mật khẩu hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    // Tạo tài khoản admin
    const adminUser = await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      isAdmin: true
    });

    console.log('Admin account created successfully:', {
      name: adminUser.name,
      email: adminUser.email,
      isAdmin: adminUser.isAdmin
    });
    
    process.exit();
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
};

createAdminUser();