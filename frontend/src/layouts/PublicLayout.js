import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PublicLayout.css';

const PublicLayout = ({ children, searchBox }) => {
  return (
    <div className="public-layout">
      <Header searchBox={searchBox} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;