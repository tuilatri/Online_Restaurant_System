import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getUsers, updateUser } from '../api';

function ProductDetail() {
  const { id } = useParams();
  const [productPrime, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const userPhone = localStorage.getItem('user_phone');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getProduct(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const addToCart = async () => {
    try {
      const cartItem = { productId: parseInt(id), quantity, note };
      const response = await getUsers();
      const user = response.data.find(u => u.phone === userPhone);
      const existingCart = user.cart ? JSON.parse(user.cart) : [];
      existingCart.push(cartItem);
      await updateUser(userPhone, { cart: JSON.stringify(existingCart) });
      alert('Đã thêm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Thêm vào giỏ hàng thất bại!');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="product-detail">
        <img src={`http://localhost:5000${product.img}`} alt={product.title} className="product-image" />
        <div className="product-info">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p className="current-price">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
          <div className="product-actions">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <input
              type="text"
              placeholder="Ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button className="primary-button" onClick={addToCart}>Thêm vào giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;