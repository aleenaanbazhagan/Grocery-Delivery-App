const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!deliveryAddress || !deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.street || !deliveryAddress.city) {
      return res.status(400).json({ message: 'Please provide complete delivery address' });
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 20 : 0;
    const total = subtotal + deliveryFee;

    const estimatedDelivery = new Date();
    estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 30);

    const order = new Order({
      user: req.user._id,
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cod',
      estimatedDelivery,
      notes
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('items.product');

    res.status(201).json({
      message: 'Order placed successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product');

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
