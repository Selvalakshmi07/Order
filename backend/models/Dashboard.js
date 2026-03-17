const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  layout: { type: Array, default: [] },
  widgets: { type: Array, default: [] },
  filters: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dashboard', DashboardSchema);
