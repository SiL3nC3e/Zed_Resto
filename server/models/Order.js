import mongoose from 'mongoose';

const ORDER_STATUSES = [
  'received',
  'in_preparation',
  'ready',
  'out_for_delivery',
  'delivered',
  'picked_up',
  'cancelled',
];

const orderItemSchema = new mongoose.Schema({
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
  name: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
  image: String,
  notes: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestInfo: {
      name: String,
      email: String,
      phone: String,
    },
    items: [orderItemSchema],
    orderType: { type: String, enum: ['delivery', 'pickup', 'dine_in'], default: 'delivery' },
    deliveryAddress: {
      street: String,
      city: String,
      zip: String,
      instructions: String,
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    promoCode: { type: String, default: '' },
    total: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'received' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    loyaltyPointsEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ZR-${Date.now().toString(36).toUpperCase()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);
export { ORDER_STATUSES };
