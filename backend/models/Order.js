const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  customerName: { type: String }, // Can be derived from first/last name
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Delivered', 'Processing', 'Cancelled', 'Shipped', 'Pending'], default: 'Pending' },
  createdBy: { type: String, required: true },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
