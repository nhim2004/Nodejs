// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function ProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showChangePassword, setShowChangePassword] = useState(false); // <-- Trạng thái hiện form đổi mật khẩu
  const [toast, setToast] = useState({ message: '', type: '' });

  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    dienThoai: '',
    ngaySinh: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        hoTen: user.hoTen || '',
        email: user.email || '',
        dienThoai: user.dienThoai || '',
        ngaySinh: user.ngaySinh ? user.ngaySinh.split('T')[0] : '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      fetchOrders();
    }
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders/myorders', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({}), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu đổi mật khẩu → kiểm tra khớp
    if (showChangePassword && formData.newPassword !== formData.confirmPassword) {
      showToast('Mật khẩu mới không khớp!', 'error');
      return;
    }

    setLoading(true);
    try {
      const body = {
        hoTen: formData.hoTen,
        email: formData.email,
        dienThoai: formData.dienThoai,
        ngaySinh: formData.ngaySinh
      };

      // Chỉ gửi mật khẩu nếu đang đổi
      if (showChangePassword) {
        if (!formData.currentPassword) {
          showToast('Vui lòng nhập mật khẩu hiện tại!', 'error');
          setLoading(false);
          return;
        }
        body.password = formData.currentPassword;
        body.newPassword = formData.newPassword;
      }

      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cập nhật thất bại');

      login({ ...user, ...data });
      showToast('Cập nhật hồ sơ thành công!');

      // Reset form đổi mật khẩu
      if (showChangePassword) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setShowChangePassword(false); // Ẩn lại sau khi đổi
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      {/* Toast */}
      {toast.message && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast({})}>×</button>
        </div>
      )}

      <div className="profile-grid">
        {/* Cột 1: Thông tin cá nhân */}
        <div className="profile-card info-card">
          <div className="card-header">
            <h2>Thông tin cá nhân</h2>
          </div>

          <div className="avatar-large">
            <div className="avatar-circle">
              {user.hoTen?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="input-group">
              <label>Họ và tên</label>
              <input name="hoTen" value={formData.hoTen} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Số điện thoại</label>
              <input name="dienThoai" value={formData.dienThoai} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Ngày sinh</label>
              <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} />
            </div>

            {/* Nút bật/tắt đổi mật khẩu */}
            <div className="change-password-trigger">
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                {showChangePassword ? 'Ẩn form đổi mật khẩu' : 'Đổi mật khẩu'}
              </button>
            </div>

            {/* Form đổi mật khẩu (chỉ hiện khi bật) */}
            {showChangePassword && (
              <div className="password-change-section">
                <div className="input-group">
                  <label>Mật khẩu hiện tại <span className="required">*</span></label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    placeholder="Xác minh danh tính"
                  />
                </div>

                <div className="input-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    minLength="6"
                    placeholder="Ít nhất 6 ký tự"
                  />
                </div>

                <div className="input-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-update">
              {loading ? (
                <>
                  <span className="spinner"></span> Đang cập nhật...
                </>
              ) : (
                'Cập nhật hồ sơ'
              )}
            </button>
          </form>
        </div>

        {/* Cột 2: Lịch sử đặt hàng */}
        <div className="profile-card orders-card">
          <div className="card-header">
            <h2>Lịch sử đặt hàng</h2>
            <span className="order-count">{orders.length} đơn</span>
          </div>

          <div className="orders-list">
            {orders.length === 0 ? (
              <p className="empty-state">Chưa có đơn hàng nào</p>
            ) : (
              orders.map(order => (
                <div key={order._id} className="order-item">
                  <div className="order-info">
                    <div className="order-id">#{order._id.slice(-6)}</div>
                    <div className="order-date">
                      {new Date(order.ngayDat).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="order-details">
                    <div className="order-total">
                      {order.tongTien.toLocaleString()} ₫
                    </div>
                    <div className={`order-status status-${order.trangThai}`}>
                      {formatStatus(order.trangThai)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper
const formatStatus = (status) => {
  const map = {
    cho_xac_nhan: 'Chờ xác nhận',
    dang_xu_ly: 'Đang xử lý',
    dang_giao: 'Đang giao',
    hoan_thanh: 'Hoàn thành',
    da_huy: 'Đã hủy'
  };
  return map[status] || status;
};

export default ProfilePage;