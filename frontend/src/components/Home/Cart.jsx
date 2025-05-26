import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, updateUser, getUsers } from '../api';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const userPhone = localStorage.getItem('user_phone');

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await getUsers();
      const user = response.data.find(u => u.phone === userPhone);
      if (user && user.cart) {
        setCartItems(JSON.parse(user.cart));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateCart = async (updatedCart) => {
    try {
      await updateUser(userPhone, { cart: JSON.stringify(updatedCart) });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const updateQuantity = (index, quantity) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = parseInt(quantity);
    setCartItems(updatedCart);
    updateCart(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    updateCart(updatedCart);
  };

  const total = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="container">
      <h2>Giỏ hàng</h2>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Ghi chú</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => {
                const product = products.find(p => p.id === item.productId);
                return product ? (
                  <tr key={index}>
                    <td>{product.title}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, e.target.value)}
                      />
                    </td>
                    <td>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    <td>{item.note}</td>
                    <td>{(product.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    <td>
                      <button onClick={() => removeItem(index)}>Xóa</button>
                    </td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
          <p>Tổng cộng: {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
          <Link to="/checkout" className="primary-button">Thanh toán</Link>
        </>
      )}
    </div>
  );
}

export default Cart;