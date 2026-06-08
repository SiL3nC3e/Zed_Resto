import express from 'express';
import { Promotion } from '../models/Promotion.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
const STAFF = ['super_admin', 'manager'];

router.post('/validate', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const promo = await Promotion.findOne({
      code: code.toUpperCase(),
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    });
    if (!promo) return res.status(404).json({ message: 'Invalid promo code' });
    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ message: 'Promo code has reached max uses' });
    }
    if (subtotal < promo.minSpend) {
      return res.status(400).json({
        message: `Minimum spend of $${promo.minSpend} required`,
      });
    }
    const discount =
      promo.discountType === 'percentage'
        ? subtotal * (promo.discountValue / 100)
        : promo.discountValue;
    res.json({ code: promo.code, discount, discountType: promo.discountType });
  } catch (err) {
    next(err);
  }
});

router.get('/', protect, authorize(...STAFF), async (req, res, next) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.json(promotions);
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, authorize(...STAFF), async (req, res, next) => {
  try {
    const promo = await Promotion.create(req.body);
    res.status(201).json(promo);
  } catch (err) {
    next(err);
  }
});

export default router;
