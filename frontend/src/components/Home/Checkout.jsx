import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, getProducts, getUsers, updateUser } from '../api';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    delivery_method: 'Giao hàng tận nơi',
    delivery_date: '',
    delivery_time: 'Giao ngay khi xong',
    note: '',
    receiver_name: '',
    receiver_phone: '',
    receiver_address: '',
  });
  const navigate = useNavigate();
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

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderId = `DH${Date.now()}`;
      const total = cartItems.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);

      const order = {
        id: orderId,
        user_phone: form.receiver_phone || userPhone,
        ...form,
        total_amount: total,
        status: 1
      };

      const details = cartItems.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: products.find(p => p.id === item.productId)?.price,
        note: item.note
      }));

      await createOrder({ order, details });
      await updateUser(userPhone, { cart: '[]' }); // Clear cart
      alert('Đặt hàng thành công!');
      navigate('/order-history');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Đặt hàng thất bại!');
    }
  };

  return (
    <div className="container">
      <h2>Thanh toán</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Phương thức giao hàng</label>
          <select name="delivery_method" value={form.delivery_method} onChange={handleInputChange}>
            <option value="Giao hàng tận">Giao hàng tận nơi</option>
            <option value="Nhận tại quán">Nhận tại quán</option>
          </select>
        </div>
        <div className="form-group">
          <label>Ngày giao</label>
          <input
            type="date"
            name="delivery_date"
            value={form.delivery_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Thời gian giao</label>
          <select name="delivery_time" value={form.delivery_time} onChange={handleInputChange}>
            <option value="Giao ngay khi xong">Giao ngay khi xong</option>
            <option value="Trong vòng 1 giờ">Trong vòng 1 giờ</option>
            <option value="Trong vòng 2 giờ">Trong vòng 2 giờ</option>
          </select>
        </div>
        <div className="form-group">
          <label>Ghi chú</label>
          <textarea name="note" value={form.note} onChange={handleInputChange}></textarea>
        </div>
        <div className="form-group">
          <label>Tên người nhận</label>
          <input
            type="text"
            name="receiver_name"
            value={form.receiver_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="receiver_phone"
            value={form.receiver_phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="receiver_address"
            value={form.receiver_address}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="primary-button">Xác nhận đặt hàng</button>
      </form>
    </div>
  );
}

export default Checkout;