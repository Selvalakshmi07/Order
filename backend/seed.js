const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

const sampleOrders = [
  {
    customerId: "C001",
    customerName: "John Doe",
    email: "john@email.com",
    product: "Laptop",
    quantity: 2,
    unitPrice: 500,
    totalAmount: 1000,
    status: "Delivered",
    createdBy: "Admin",
    orderDate: new Date('2026-01-01')
  },
  {
    customerId: "C002",
    customerName: "Jane Smith",
    email: "jane@email.com",
    product: "Phone",
    quantity: 1,
    unitPrice: 800,
    totalAmount: 800,
    status: "Processing",
    createdBy: "Admin",
    orderDate: new Date('2026-01-15')
  },
  {
    customerId: "C003",
    customerName: "Bob Johnson",
    email: "bob@email.com",
    product: "Monitor",
    quantity: 3,
    unitPrice: 200,
    totalAmount: 600,
    status: "Shipped",
    createdBy: "Admin",
    orderDate: new Date('2026-02-10')
  },
  {
    customerId: "C004",
    customerName: "Alice Brown",
    email: "alice@email.com",
    product: "Keyboard",
    quantity: 5,
    unitPrice: 50,
    totalAmount: 250,
    status: "Delivered",
    createdBy: "Admin",
    orderDate: new Date('2026-03-01')
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hallyex')
  .then(async () => {
    console.log('Seed: Connected to MongoDB');
    await Order.deleteMany({});
    await Order.insertMany(sampleOrders);
    console.log('Seed: Sample orders inserted');
    process.exit();
  })
  .catch(err => {
    console.error('Seed: Error', err);
    process.exit(1);
  });
