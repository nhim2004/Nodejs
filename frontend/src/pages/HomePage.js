// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShopLayout from '../layouts/ShopLayout';
import SearchBox from '../components/SearchBox';
import './HomePage.css'; // IMPORT CSS MỚI

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const HomePage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/api/products`;
        if (selectedCategory !== 'all') {
          url = `${API_URL}/api/products/category/${selectedCategory}`;
        }
        const res = await fetch(url);
        let data = await res.json();
        
        if (searchQuery) {
          data = data.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  return (
    <ShopLayout
      onCategorySelect={setSelectedCategory}
      selectedCategory={selectedCategory}
      searchBox={<SearchBox onSearch={setSearchQuery} />}
    >
      <div className="page-content">
        {/* Hero */}
        <section className="hero">
          <h1>Chào mừng đến LaptopShop</h1>
          <p>Khám phá hàng ngàn sản phẩm công nghệ chất lượng cao!</p>
        </section>

        {/* Kết quả */}
        <section className="products-section">
          <div className="section-header">
            <h2>
              {searchQuery
                ? `Tìm kiếm: "${searchQuery}"`
                : selectedCategory === 'all'
                ? 'Tất cả sản phẩm'
                : selectedCategory}
            </h2>
            <span className="result-count">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(p => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="product-card"
                >
                  <div className="product-image">
                    <img
                      src={p.image || '/placeholder.jpg'}
                      alt={p.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{p.name}</h3>
                    <p className="product-price">
                      {p.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="no-products">Không tìm thấy sản phẩm nào.</p>
          )}
        </section>
      </div>
    </ShopLayout>
  );
};

export default HomePage;