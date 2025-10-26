import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <i className="fas fa-shopping-cart cart-icon"></i>
        <h2>Giỏ hàng trống</h2>
        <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link to="/" className="continue-shopping">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Giỏ hàng của bạn</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="item-details">
                <Link to={`/product/${item._id}`} className="item-name">
                  {item.name}
                </Link>
                <p className="item-price">{item.price.toLocaleString('vi-VN')}₫</p>
              </div>

              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  className="quantity-btn"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div className="item-subtotal">
                <p>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="remove-item"
                aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Tổng giỏ hàng</h2>
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{cart.total.toLocaleString('vi-VN')}₫</span>
          </div>
          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <span>{cart.total.toLocaleString('vi-VN')}₫</span>
          </div>
          <button className="checkout-button">
            Tiến hành thanh toán
          </button>
          <Link to="/" className="continue-shopping">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;