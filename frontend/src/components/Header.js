// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Header.css";

const Header = ({ searchBox }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">LaptopShop</Link>

      {/* Search Box - Chỉ hiện nếu có */}
      {searchBox && <div className="header-search">{searchBox}</div>}

      {/* Navigation */}
      <nav className="nav-links">
        <Link to="/" className="nav-link">Trang chủ</Link>
        
        {/* Giỏ hàng */}
        <Link to="/cart" className="nav-link cart-link">
          <i className="fas fa-shopping-cart"></i>
          <span className="cart-label">Giỏ hàng</span>
          <span className="cart-count">{cart.items.length}</span>
        </Link>

        {user ? (
          <div className="user-menu">
            <span className="user-name">
              Xin chào, <strong>{user.hoTen || user.name}</strong>
            </span>
            {user.isAdmin ? (
              <Link to="/admin" className="nav-link">Quản trị</Link>
            ) : (
              <Link to="/profile" className="nav-link">Hồ sơ</Link>
            )}
            <button onClick={handleLogout} className="logout-btn">
              Đăng xuất
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">Đăng nhập</Link>
            <Link to="/register" className="nav-link">Đăng ký</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;