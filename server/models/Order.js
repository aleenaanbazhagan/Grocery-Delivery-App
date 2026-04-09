const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  image: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unit: String
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 20
  },
  total: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    landmark: { type: String }
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'upi', 'netbanking'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimatedDelivery: {
    type: Date
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
