import React from 'react';
import PublicLayout from '../layouts/PublicLayout';
import CategorySidebar from '../components/CategorySidebar';
import './ShopLayout.css';

const ShopLayout = ({ 
  children, 
  onCategorySelect, 
  selectedCategory,
  searchBox 
}) => {
  return (
    <PublicLayout searchBox={searchBox}>
      <div className="shop-layout">
        <aside className="sidebar">
          <CategorySidebar 
            onCategorySelect={onCategorySelect}
            selectedCategory={selectedCategory}
          />
        </aside>
        <main className="shop-content">
          {children}
        </main>
      </div>
    </PublicLayout>
  );
};

export default ShopLayout;