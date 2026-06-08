import mongoose from 'mongoose';

const RESERVATION_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    partySize: { type: Number, required: true, min: 1, max: 20 },
    seatingPreference: {
      type: String,
      enum: ['indoor', 'outdoor', 'window', 'private', 'no_preference'],
      default: 'no_preference',
    },
    specialRequests: { type: String, default: '' },
    status: { type: String, enum: RESERVATION_STATUSES, default: 'pending' },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model('Reservation', reservationSchema);
export { RESERVATION_STATUSES };
