import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';
import './ProductPage.css';

function ProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const { id } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>The requested product could not be found.</p>
      </div>
    );
  }

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <div className="product-details">
        <img 
          src={product.image} 
          alt={product.name}
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
            e.target.onerror = null;
          }}
        />
        <div className="product-info">
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>
          <div className="stock-status">
            <p>Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</p>
            {product.countInStock > 0 && (
              <p className="stock-count">({product.countInStock} available)</p>
            )}
          </div>
          <div className="quantity-control">
            <button 
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button 
              onClick={() => setQuantity(prev => Math.min(product.countInStock, prev + 1))}
              disabled={quantity >= product.countInStock}
            >
              +
            </button>
          </div>
          
          <button 
            className="add-to-cart"
            disabled={product.countInStock === 0}
            onClick={() => {
              addToCart({ ...product, quantity });
              setShowToast(true);
              setQuantity(1); // Reset quantity sau khi thêm
            }}
          >
            <i className="fas fa-shopping-cart"></i>
            {product.countInStock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </button>
          
          {showToast && (
            <Toast
              message={`Đã thêm ${product.name} vào giỏ hàng`}
              type="success"
              onClose={() => setShowToast(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;