// src/components/CategorySidebar.jsx
import React, { useState } from 'react';
import './CategorySidebar.css';

const categories = [
  { 
    title: "Laptop", 
    icon: "fa-laptop", 
    subItems: ["Laptop Gaming", "Laptop văn phòng", "Laptop Apple"]
  },
  { 
    title: "PC & Workstation", 
    icon: "fa-desktop", 
    subItems: ["PC Gaming", "PC văn phòng", "Workstation"]
  },
  { 
    title: "Linh kiện", 
    icon: "fa-microchip", 
    subItems: ["CPU", "RAM", "Mainboard", "Card đồ họa", "Nguồn máy tính"]
  },
  { 
    title: "Màn hình", 
    icon: "fa-tv", 
    subItems: ["Màn hình Gaming", "Màn hình văn phòng", "Màn hình đồ họa"]
  },
  { 
    title: "Gaming Gear", 
    icon: "fa-gamepad", 
    subItems: ["Chuột Gaming", "Bàn phím Gaming", "Tai nghe Gaming", "Ghế Gaming"]
  },
  {
    title: "Phụ kiện",
    icon: "fa-keyboard",
    subItems: ["Bàn phím", "Chuột", "Tai nghe", "Loa", "Webcam"]
  }
];

const CategorySidebar = ({ onCategorySelect, selectedCategory }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <nav className="category-sidebar" aria-label="Danh mục sản phẩm chính">
      <div className="category-header" aria-hidden="true">
        DANH MỤC SẢN PHẨM
      </div>
      <ul className="category-list">
        {/* Tất cả sản phẩm */}
        <li className="category-item">
          <button
            className={`category-title all ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => onCategorySelect('all')}
            aria-current={selectedCategory === 'all' ? 'page' : 'false'}
          >
            <i className="fas fa-th-large icon"></i>
            <span>Tất cả sản phẩm</span>
          </button>
        </li>

        {/* Danh mục chính */}
        {categories.map((cat, index) => {
          const submenuId = `submenu-${index}`;
          const titleId = `cat-title-${index}`;
          const isTitleActive = selectedCategory === cat.title;
          const isHovered = hoveredIndex === index;

          return (
            <li
              key={index}
              className="category-item"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Tiêu đề danh mục - CÓ THỂ CLICK */}
              <button
                id={titleId}
                className={`category-title ${isHovered ? 'hovered' : ''} ${isTitleActive ? 'active' : ''}`}
                onClick={() => onCategorySelect(cat.title)} // Bấm vào tiêu đề
                aria-expanded={isHovered}
                aria-controls={submenuId}
                aria-current={isTitleActive ? 'page' : 'false'}
              >
                <i className={`fas ${cat.icon} icon`}></i>
                <span>{cat.title}</span>
                <i className={`fas fa-chevron-right arrow ${isHovered ? 'open' : ''}`}></i>
              </button>

              {/* Submenu - chỉ hiện khi hover */}
              {isHovered && (
                <ul
                  id={submenuId}
                  className="submenu open"
                  role="group"
                  aria-labelledby={titleId}
                >
                  {cat.subItems.map((sub, i) => {
                    const isSubActive = selectedCategory === sub;

                    return (
                      <li key={i} className="submenu-item">
                        <button
                          className={`submenu-link ${isSubActive ? 'active' : ''}`}
                          onClick={() => onCategorySelect(sub)}
                          aria-current={isSubActive ? 'page' : 'false'}
                        >
                          {sub}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategorySidebar;