import React, { useState, useEffect } from 'react';
import { getProducts } from '../api';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.filter(p => p.status === 1));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = category === 'Tất cả' ? true : product.category === category;
    const matchesSearch = product.title.toUpperCase().includes(search.toUpperCase());
    const matchesMinPrice = minPrice ? product.price >= parseInt(minPrice) : true;
    const matchesMaxPrice = maxPrice ? product.price <= parseInt(maxPrice) : true;
    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="container">
      <div className="advanced-search">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Tất cả</option>
          <option>Món chay</option>
          <option>Món mặn</option>
          <option>Món lẩu</option>
          <option>Món ăn vặt</option>
          <option>Món tráng miệng</option>
          <option>Nước uống</option>
        </select>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Giá từ"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Giá đến"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <div id="home-products" className="row">
        {filteredProducts.length === 0 ? (
          <div className="no-result">
            <div className="no-result-h">Tìm kiếm không có kết quả</div>
            <div className="no-result-p">Xin lỗi, chúng tôi không thể tìm được kết quả hợp với tìm kiếm của bạn</div>
            <div className="no-result-i"><i className="fa-light fa-face-sad-cry"></i></div>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="col-product">
              <article className="card-product">
                <div className="card-header">
                  <Link to={`/product/${product.id}`} className="card-image-link">
                    <img className="card-image" src={`http://localhost:5000${product.img}`} alt={product.title} />
                  </Link>
                </div>
                <div className="food-info">
                  <div className="card-content">
                    <div className="card-title">
                      <Link to={`/product/${product.id}`} className="card-title-link">{product.title}</Link>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="product-price">
                      <span className="current-price">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                    </div>
                    <div className="product-buy">
                      <button onClick={() => window.location.href = `/product/${product.id}`} className="card-button order-item">
                        <i className="fa-regular fa-cart-shopping-fast"></i> Đặt món
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;