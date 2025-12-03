import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

/**
 * Routes upload file (ảnh)
 * - Sử dụng multer để nhận file multipart/form-data và lưu vào `public/images`
 * - Trả về đường dẫn tĩnh để frontend có thể hiển thị
 */
// Cấu hình lưu trữ multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép file ảnh!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// POST /api/upload -> Upload 1 ảnh (field name: 'image')
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Không có file được tải lên' });

    // Trả về đường dẫn public để frontend lấy ảnh
    const imageUrl = `/images/${req.file.filename}`;
    res.status(201).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
