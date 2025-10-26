// src/components/MainLayout.jsx
import React from 'react';
import Header from './Header';
import CategorySidebar from './CategorySidebar';
import './MainLayout.css';

const MainLayout = ({ 
  children, 
  onCategorySelect, 
  selectedCategory,
  searchBox // NHẬN SEARCH BOX TỪ TRANG
}) => {
  return (
    <>
      <Header searchBox={searchBox} /> {/* ĐƯA SEARCH VÀO HEADER */}
      <div className="main-layout-container">
        <aside className="sidebar">
          <CategorySidebar 
            onCategorySelect={onCategorySelect}
            selectedCategory={selectedCategory}
          />
        </aside>
        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
};

export default MainLayout;