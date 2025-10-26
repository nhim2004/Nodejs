// src/components/SearchBox.jsx
import React, { useState, useEffect } from 'react';

const SearchBox = ({ onSearch, placeholder = "Tìm sản phẩm..." }) => {
  const [query, setQuery] = useState('');

  // Gửi query lên parent mỗi khi thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="search-box">
      <i className="fas fa-search search-icon"></i>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        aria-label="Tìm kiếm sản phẩm"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="clear-btn"
          aria-label="Xóa tìm kiếm"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBox;