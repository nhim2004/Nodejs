import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    parentCategory: '',
    brand: '',
    countInStock: ''
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    console.log('Fetching products...');
    try {
      // Lấy token từ localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      console.log('UserInfo:', userInfo);
      const token = userInfo?.token;
      console.log('Token:', token);

      console.log('Making API request to:', 'http://localhost:5000/api/products');
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }

      const data = await response.json();
      console.log('Fetched products:', data); // Để debug
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error loading products: ' + err.message);
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal for add/edit
  const handleAddEdit = (product = null) => {
    if (product) {
      setFormData(product);
      setSelectedProduct(product);
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
        category: '',
        parentCategory: '',
        brand: '',
        countInStock: ''
      });
      setSelectedProduct(null);
    }
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      const url = selectedProduct
        ? `http://localhost:5000/api/products/${selectedProduct._id}`
        : 'http://localhost:5000/api/products';
      
      const method = selectedProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        fetchProducts();
        alert(selectedProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
      } else {
        throw new Error('Không thể lưu sản phẩm');
      }
    } catch (err) {
      alert('Lỗi khi lưu sản phẩm: ' + err.message);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchProducts();
          alert('Xóa sản phẩm thành công!');
        } else {
          throw new Error('Không thể xóa sản phẩm');
        }
      } catch (err) {
        alert('Lỗi khi xóa sản phẩm: ' + err.message);
      }
    }
  };

  if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;
  if (error) return <AdminLayout><div>{error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-products">
        <div className="admin-products-header">
          <h2>Product Management</h2>
          <button className="btn-add" onClick={() => handleAddEdit()}>
            <i className="fas fa-plus"></i> Add Product
          </button>
        </div>

        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price.toLocaleString('vi-VN')}₫</td>
                  <td>{product.countInStock}</td>
                  <td className="actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleAddEdit(product)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Add/Edit Product */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button className="btn-close" onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price:</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock:</label>
                    <input
                      type="number"
                      name="countInStock"
                      value={formData.countInStock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL:</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category:</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Laptop Gaming">Laptop Gaming</option>
                      <option value="Laptop văn phòng">Laptop văn phòng</option>
                      <option value="Laptop Apple">Laptop Apple</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Parent Category:</label>
                    <select
                      name="parentCategory"
                      value={formData.parentCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Parent Category</option>
                      <option value="Laptop">Laptop</option>
                      <option value="PC & Workstation">PC & Workstation</option>
                      <option value="Phụ kiện">Phụ kiện</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Brand:</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {selectedProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;