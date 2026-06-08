import express from 'express';
import { Reservation } from '../models/Reservation.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();
const STAFF = ['super_admin', 'manager', 'waiter'];

router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { date, time, partySize, seatingPreference, specialRequests, guestInfo } = req.body;
    if (!date || !time || !partySize) {
      return res.status(400).json({ message: 'Date, time, and party size are required' });
    }
    if (!req.user && !guestInfo?.name) {
      return res.status(400).json({ message: 'Guest information is required' });
    }

    const reservation = await Reservation.create({
      user: req.user?._id || null,
      guestInfo: req.user
        ? { name: req.user.name, email: req.user.email, phone: req.user.phone || '' }
        : guestInfo,
      date: new Date(date),
      time,
      partySize,
      seatingPreference: seatingPreference || 'no_preference',
      specialRequests: specialRequests || '',
    });

    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
});

router.get('/my', protect, async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).sort({ date: -1 });
    res.json(reservations);
  } catch (err) {
    next(err);
  }
});

router.get('/admin/all', protect, authorize(...STAFF), async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const reservations = await Reservation.find(filter)
      .populate('user', 'name email phone')
      .sort({ date: 1 });
    res.json(reservations);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', protect, authorize(...STAFF), async (req, res, next) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    next(err);
  }
});

export default router;
