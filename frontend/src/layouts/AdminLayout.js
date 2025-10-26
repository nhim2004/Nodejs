import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('userInfo')); // Lấy thông tin user từ localStorage

  // Kiểm tra quyền admin
  if (!user || !user.isAdmin) {
    return (
      <div className="admin-unauthorized">
        <h1>Không có quyền truy cập</h1>
        <p>Bạn cần đăng nhập với tài khoản admin để truy cập trang này.</p>
        <Link to="/login" className="btn-login">Đăng nhập</Link>
      </div>
    );
  }

  // Danh sách menu admin
  const menuItems = [
    { path: '/admin/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { path: '/admin/products', icon: 'fas fa-box', label: 'Sản phẩm' },
    { path: '/admin/orders', icon: 'fas fa-shopping-cart', label: 'Đơn hàng' },
    { path: '/admin/users', icon: 'fas fa-users', label: 'Người dùng' },
    { path: '/admin/categories', icon: 'fas fa-tags', label: 'Danh mục' }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link to="/">
            <span className="logo-text">LaptopShop</span>
          </Link>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1>{menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}</h1>
          </div>
          <div className="header-right">
            <div className="admin-profile">
              <span className="admin-name">{user.name}</span>
              <div className="admin-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;