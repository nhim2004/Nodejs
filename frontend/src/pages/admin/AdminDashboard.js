import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="dashboard-grid">
        {/* Thống kê tổng quan */}
        <div className="stats-grid">
          <div className="stat-card">
            <i className="fas fa-shopping-cart stat-icon"></i>
            <div className="stat-info">
              <h3>Đơn hàng</h3>
              <p className="stat-value">125</p>
              <p className="stat-label">Tuần này</p>
            </div>
          </div>

          <div className="stat-card">
            <i className="fas fa-users stat-icon"></i>
            <div className="stat-info">
              <h3>Khách hàng</h3>
              <p className="stat-value">1,240</p>
              <p className="stat-label">Tổng số</p>
            </div>
          </div>

          <div className="stat-card">
            <i className="fas fa-dollar-sign stat-icon"></i>
            <div className="stat-info">
              <h3>Doanh thu</h3>
              <p className="stat-value">52.5M</p>
              <p className="stat-label">Tháng này</p>
            </div>
          </div>

          <div className="stat-card">
            <i className="fas fa-box stat-icon"></i>
            <div className="stat-info">
              <h3>Sản phẩm</h3>
              <p className="stat-value">284</p>
              <p className="stat-label">Đang bán</p>
            </div>
          </div>
        </div>

        {/* Đơn hàng gần đây */}
        <div className="recent-orders">
          <h2>Đơn hàng gần đây</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#12345</td>
                  <td>Nguyễn Văn A</td>
                  <td>Laptop Dell XPS 15</td>
                  <td>35,990,000₫</td>
                  <td><span className="status pending">Đang xử lý</span></td>
                </tr>
                <tr>
                  <td>#12344</td>
                  <td>Trần Thị B</td>
                  <td>MacBook Pro 16"</td>
                  <td>52,990,000₫</td>
                  <td><span className="status completed">Đã giao</span></td>
                </tr>
                {/* Thêm các đơn hàng khác */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Biểu đồ & thống kê khác */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Doanh số theo danh mục</h3>
            <div className="chart-placeholder">
              {/* Sẽ thêm biểu đồ sau */}
              <p>Biểu đồ thống kê doanh số</p>
            </div>
          </div>

          <div className="chart-card">
            <h3>Top sản phẩm bán chạy</h3>
            <ul className="top-products">
              <li>
                <span className="product-name">MacBook Pro</span>
                <span className="product-sales">145 đã bán</span>
              </li>
              <li>
                <span className="product-name">Dell XPS 15</span>
                <span className="product-sales">98 đã bán</span>
              </li>
              <li>
                <span className="product-name">Asus ROG</span>
                <span className="product-sales">76 đã bán</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;