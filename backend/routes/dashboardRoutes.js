const express = require('express');
const router = express.Router();
const Dashboard = require('../models/Dashboard');

// Get all dashboards
router.get('/', async (req, res) => {
  try {
    const dashboards = await Dashboard.find();
    res.json(dashboards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dashboard by ID
router.get('/:id', async (req, res) => {
  try {
    const dashboard = await Dashboard.findById(req.params.id);
    if (!dashboard) return res.status(404).json({ message: 'Dashboard not found' });
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create dashboard
router.post('/', async (req, res) => {
  const dashboard = new Dashboard(req.body);
  try {
    const newDashboard = await dashboard.save();
    res.status(201).json(newDashboard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update dashboard
router.put('/:id', async (req, res) => {
  try {
    const updatedDashboard = await Dashboard.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(updatedDashboard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete dashboard
router.delete('/:id', async (req, res) => {
  try {
    await Dashboard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dashboard deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
