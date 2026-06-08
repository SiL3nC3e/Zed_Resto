import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Dish } from './models/Dish.js';
import { Promotion } from './models/Promotion.js';
import { Review } from './models/Review.js';
import { dishes } from './data/dishes.js';

const isFresh = process.argv.includes('--fresh');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const dishCount = await Dish.countDocuments();
  if (dishCount > 0 && !isFresh) {
    console.log(
      'Database already has data — skipping seed to preserve your edits.\n' +
        'Use "npm run seed:fresh" to wipe and re-seed everything.'
    );
    process.exit(0);
  }

  if (isFresh) console.log('Fresh seed: wiping existing data...');

  await User.deleteMany({});
  await Dish.deleteMany({});
  await Promotion.deleteMany({});
  await Review.deleteMany({});

  const users = await User.create([
    {
      name: 'Admin Zed',
      email: 'admin@zedresto.com',
      password: 'admin123',
      role: 'super_admin',
      phone: '+1 555 0100',
    },
    {
      name: 'Chef Laurent',
      email: 'chef@zedresto.com',
      password: 'chef123',
      role: 'chef',
      phone: '+1 555 0101',
    },
    {
      name: 'Guest Diner',
      email: 'guest@zedresto.com',
      password: 'guest123',
      role: 'customer',
      phone: '+1 555 0102',
      loyaltyPoints: 150,
    },
  ]);

  const insertedDishes = await Dish.insertMany(dishes);
  const guest = users.find((u) => u.email === 'guest@zedresto.com');

  const sampleReviews = [
    {
      user: guest._id,
      dish: insertedDishes[3]._id,
      rating: 5,
      comment: 'The wagyu melted on the tongue — truly unforgettable. A must-order.',
    },
    {
      user: guest._id,
      dish: insertedDishes[7]._id,
      rating: 5,
      comment: 'Perfectly risen soufflé with rich chocolate. Order early with your mains!',
    },
    {
      user: guest._id,
      dish: insertedDishes[0]._id,
      rating: 4,
      comment: 'Delicate truffle flavor and a beautiful crisp exterior. Excellent starter.',
    },
  ];
  await Review.insertMany(sampleReviews);

  for (const dish of insertedDishes) {
    const dishReviews = sampleReviews.filter(
      (r) => r.dish.toString() === dish._id.toString()
    );
    if (dishReviews.length) {
      const avg =
        dishReviews.reduce((s, r) => s + r.rating, 0) / dishReviews.length;
      await Dish.findByIdAndUpdate(dish._id, {
        rating: Math.round(avg * 10) / 10,
        reviewCount: dishReviews.length,
      });
    }
  }

  await Promotion.create([
    {
      code: 'WELCOME15',
      description: 'Welcome offer — 15% off your first order',
      discountType: 'percentage',
      discountValue: 15,
      minSpend: 30,
      maxUses: 500,
    },
    {
      code: 'ZEDVIP',
      description: 'VIP flat discount',
      discountType: 'flat',
      discountValue: 10,
      minSpend: 50,
    },
  ]);

  console.log('Seed complete!');
  console.log('Admin: admin@zedresto.com / admin123');
  console.log('Chef:  chef@zedresto.com / chef123');
  console.log('Guest: guest@zedresto.com / guest123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
