import express from 'express';
import { Review } from '../models/Review.js';
import { Dish } from '../models/Dish.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
const STAFF = ['super_admin', 'manager'];

async function syncDishRating(dishId) {
  const reviews = await Review.find({ dish: dishId, isApproved: true });
  const reviewCount = reviews.length;
  const rating = reviewCount
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
    : 0;
  await Dish.findByIdAndUpdate(dishId, { rating, reviewCount });
  return { rating, reviewCount };
}

router.get('/dish/:dishId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ dish: req.params.dishId, isApproved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.get('/mine', protect, async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('dish', 'name image')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { dishId, rating, comment } = req.body;
    if (!dishId || !rating) {
      return res.status(400).json({ message: 'Dish and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const dish = await Dish.findById(dishId);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    const review = await Review.findOneAndUpdate(
      { user: req.user._id, dish: dishId },
      { rating, comment: comment || '', isApproved: true },
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name');

    const stats = await syncDishRating(dishId);
    res.status(201).json({ review, ...stats });
  } catch (err) {
    next(err);
  }
});

router.get('/admin/all', protect, authorize(...STAFF), async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('dish', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/moderate', protect, authorize(...STAFF), async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await syncDishRating(review.dish);
    res.json(review);
  } catch (err) {
    next(err);
  }
});

export default router;
