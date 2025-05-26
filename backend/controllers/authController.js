const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await Account.getByPhone(phone);
    if (!user) {
      return res.status(400).json({ message: 'Số điện thoại không tồn tại' });
    }
    if (user.password !== password) { // Plain text comparison
      return res.status(400).json({ message: 'Mật khẩu không đúng' });
    }
    const token = jwt.sign(
      { phone: user.phone, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      token,
      user: {
        phone: user.phone,
        fullname: user.fullname,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng nhập', error });
  }
};

exports.register = async (req, res) => {
  try {
    const { fullname, phone, password, email, address } = req.body;
    const existingUser = await Account.getByPhone(phone);
    if (existingUser) {
      return res.status(400).json({ message: 'Số điện thoại đã được đăng ký' });
    }
    await Account.create({
      fullname,
      phone,
      password, // Plain text password
      email,
      address,
      status: 1,
      userType: 0,
      cart: '[]'
    });
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng ký', error });
  }
};