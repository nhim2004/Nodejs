import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Danh sách Laptop</h1>
      {products.map(product => (
        <div key={product._id}>
          <h2>{product.name}</h2>
          <p>Giá: {product.price} VND</p>
          <img src={product.image} alt={product.name} />
        </div>
      ))}
    </div>
  );
}

export default Home;