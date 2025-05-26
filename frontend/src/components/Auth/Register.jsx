import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';

function Register() {
  const [form, setForm] = useState({
    fullname: '',
    phone: '',
    password: '',
    email: '',
    address: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="container">
      <h2>Đăng ký</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Họ và tên</label>
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="button">Đăng ký</button>
 WesleyBody
      </form>
    </div>
  );
}

export default Register;