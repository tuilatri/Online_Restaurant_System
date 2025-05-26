const Order = require('../models/Order');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { order, details } = req.body;
    await Order.create(order, details);
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    await Order.update(req.params.id, req.body);
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};