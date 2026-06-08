import express from 'express';
import mongoose from 'mongoose';
import { Dish } from '../models/Dish.js';
import { protect, authorize } from '../middleware/auth.js';
import { ADMIN_ROLES, KITCHEN_ROLES } from '../middleware/roles.js';

const router = express.Router();

/** Validate cart items against current menu — refreshes prices/images, drops stale IDs */
router.post('/validate-cart', async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!items?.length) return res.json({ items: [], removed: [] });

    const ids = items
      .map((i) => String(i.dishId))
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const dishes = await Dish.find({ _id: { $in: ids }, isAvailable: true });
    const dishMap = Object.fromEntries(dishes.map((d) => [d._id.toString(), d]));

    const refreshed = [];
    const removed = [];

    for (const item of items) {
      const dish = dishMap[String(item.dishId)];
      if (!dish) {
        removed.push(item.name || String(item.dishId));
        continue;
      }
      refreshed.push({
        dishId: dish._id.toString(),
        name: dish.name,
        price: dish.price,
        image: dish.image,
        quantity: item.quantity,
        notes: item.notes || '',
      });
    }

    res.json({ items: refreshed, removed });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { category, dietary, minPrice, maxPrice, minRating, search, featured } = req.query;
    const filter = { isAvailable: true };

    if (category) filter.category = category;
    if (dietary) filter.dietaryTags = { $in: dietary.split(',') };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (featured === 'true') filter.isFeatured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const dishes = await Dish.find(filter).sort({ category: 1, name: 1 });
    res.json(dishes);
  } catch (err) {
    next(err);
  }
});

/** Full menu list for staff — chefs can view, managers can edit */
router.get('/admin/all', protect, authorize(...KITCHEN_ROLES), async (req, res, next) => {
  try {
    const dishes = await Dish.find().sort({ category: 1, name: 1 });
    res.json(dishes);
  } catch (err) {
    next(err);
  }
});

/** Chef can mark dishes in/out of stock (KDS requirement) */
router.patch('/:id/availability', protect, authorize(...KITCHEN_ROLES), async (req, res, next) => {
  try {
    const { isAvailable } = req.body;
    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true, runValidators: true }
    );
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json(dish);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json(dish);
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, authorize(...ADMIN_ROLES), async (req, res, next) => {
  try {
    const dish = await Dish.create(req.body);
    res.status(201).json(dish);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', protect, authorize(...ADMIN_ROLES), async (req, res, next) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json(dish);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', protect, authorize(...ADMIN_ROLES), async (req, res, next) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json({ message: 'Dish deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
