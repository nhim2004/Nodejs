// src/components/ContactBar.js
import React from 'react';
import './ContactBar.css';

const ContactBar = () => {
  return (
    <div className="contact-bar">
      {/* Chat Facebook */}
      <a
        href="https://m.me/YOUR_PAGE_ID"  // Thay YOUR_PAGE_ID bằng ID thật
        target="_blank"
        rel="noopener noreferrer"
        className="contact-item facebook"
        title="Chat Facebook"
      >
        <img src="/icons/facebook-messenger.svg" alt="Facebook" />
        <span>Chat Facebook</span>
        <small>8h-21h</small>
      </a>

      {/* Chat Zalo */}
      <a
        href="https://zalo.me/0961506888"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-item zalo"
        title="Chat Zalo"
      >
        <img src="/icons/zalo.svg" alt="Zalo" />
        <span>Chat Zalo</span>
        <small>8h-21h</small>
      </a>

      {/* Gọi điện */}
      <a
        href="tel:0961506888"
        className="contact-item phone"
        title="Gọi điện"
      >
        <img src="/icons/phone.svg" alt="Phone" />
        <span>0961506888</span>
        <small>8h-21h</small>
      </a>
    </div>
  );
};

export default ContactBar;