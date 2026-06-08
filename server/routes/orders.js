import express from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Dish } from '../models/Dish.js';
import { Promotion } from '../models/Promotion.js';
import { User } from '../models/User.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();
const STAFF = ['super_admin', 'manager', 'chef', 'waiter'];
const KITCHEN = ['super_admin', 'manager', 'chef'];

router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { items, orderType, deliveryAddress, guestInfo, promoCode } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Order must have items' });

    const dishIds = items
      .map((i) => String(i.dishId))
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const dishes = await Dish.find({ _id: { $in: dishIds }, isAvailable: true });
    const dishMap = Object.fromEntries(dishes.map((d) => [d._id.toString(), d]));

    const orderItems = [];
    const unavailable = [];

    for (const item of items) {
      const dish = dishMap[String(item.dishId)];
      if (!dish) {
        unavailable.push(item.name || item.dishId);
        continue;
      }
      orderItems.push({
        dishId: dish._id,
        name: dish.name,
        price: dish.price,
        quantity: item.quantity,
        image: dish.image,
        notes: item.notes || '',
      });
    }

    if (unavailable.length > 0 || orderItems.length !== items.length) {
      return res.status(400).json({
        message:
          'Some items in your cart are no longer available. Please refresh your cart and try again.',
        unavailable,
      });
    }

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    let discount = 0;
    let appliedPromo = '';

    if (promoCode) {
      const promo = await Promotion.findOne({
        code: promoCode.toUpperCase(),
        isActive: true,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
      });
      if (promo && subtotal >= promo.minSpend) {
        if (!promo.maxUses || promo.usedCount < promo.maxUses) {
          discount =
            promo.discountType === 'percentage'
              ? subtotal * (promo.discountValue / 100)
              : promo.discountValue;
          appliedPromo = promo.code;
          promo.usedCount += 1;
          await promo.save();
        }
      }
    }

    const total = Math.max(0, subtotal - discount);
    const loyaltyPointsEarned = req.user ? Math.floor(total / 10) : 0;

    const order = await Order.create({
      user: req.user?._id || null,
      guestInfo: req.user ? undefined : guestInfo,
      items: orderItems,
      orderType: orderType || 'delivery',
      deliveryAddress,
      subtotal,
      discount,
      promoCode: appliedPromo,
      total,
      loyaltyPointsEarned,
      paymentStatus: 'paid',
    });

    if (req.user && loyaltyPointsEarned > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { loyaltyPoints: loyaltyPointsEarned },
      });
    }

    const io = req.app.get('io');
    io?.to('kitchen').emit('new_order', order);
    io?.to(`order:${order._id}`).emit('order_update', order);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/my', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/admin/all', protect, authorize(...STAFF), async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/kitchen', protect, authorize(...KITCHEN), async (req, res, next) => {
  try {
    const orders = await Order.find({
      status: { $in: ['received', 'in_preparation', 'ready'] },
    }).sort({ createdAt: 1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const isOwner = order.user?._id?.toString() === req.user._id.toString();
    const isStaff = STAFF.includes(req.user.role) || KITCHEN.includes(req.user.role);
    if (!isOwner && !isStaff) return res.status(403).json({ message: 'Access denied' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', protect, authorize(...STAFF, ...KITCHEN), async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const io = req.app.get('io');
    io?.to(`order:${order._id}`).emit('order_update', order);
    io?.to('kitchen').emit('order_status_changed', order);

    res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
