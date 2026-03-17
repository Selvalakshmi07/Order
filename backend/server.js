const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/halleyx')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/orders', orderRoutes);
app.use('/api/dashboards', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Halleyx API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
