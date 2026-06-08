import express from 'express';
import { User } from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
const ADMIN = ['super_admin', 'manager'];

router.get('/', protect, authorize(...ADMIN), async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, authorize('super_admin'), async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password, role, phone });
    const safe = user.toObject();
    delete safe.password;
    res.status(201).json(safe);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', protect, authorize('super_admin'), async (req, res, next) => {
  try {
    const { role, isActive, name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive, name, phone },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/analytics', protect, authorize(...ADMIN), async (req, res, next) => {
  try {
    const { Order } = await import('../models/Order.js');
    const orders = await Order.find({ paymentStatus: 'paid' });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const dishSales = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const key = item.name;
        dishSales[key] = (dishSales[key] || 0) + item.quantity;
      });
    });
    const topDishes = Object.entries(dishSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const hourCounts = Array(24).fill(0);
    orders.forEach((o) => {
      hourCounts[new Date(o.createdAt).getHours()]++;
    });
    const peakHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({ totalRevenue, orderCount: orders.length, topDishes, peakHours });
  } catch (err) {
    next(err);
  }
});

export default router;
