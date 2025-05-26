const Account = require('../models/Account');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Account.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

exports.getUserByPhone = async (req, res) => {
  try {
    const user = await Account.getByPhone(req.params.phone);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

exports.createUser = async (req, res) => {
  try {
    await Account.create(req.body);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    await Account.update(req.params.phone, req.body);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await Account.delete(req.params.phone);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};