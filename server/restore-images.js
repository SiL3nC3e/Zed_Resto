import 'dotenv/config';
import mongoose from 'mongoose';
import { Dish } from './models/Dish.js';
import { dishes } from './data/dishes.js';

async function restoreImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Syncing dish images from server/data/dishes.js → MongoDB...\n');

  let updated = 0;
  for (const { name, image } of dishes) {
    const result = await Dish.updateOne({ name }, { $set: { image } });
    if (result.modifiedCount) {
      updated += 1;
      console.log(`  ✓ ${name}`);
    } else if (result.matchedCount) {
      console.log(`  — ${name} (already up to date)`);
    } else {
      console.log(`  ? ${name} (not found in database)`);
    }
  }

  console.log(`\nDone — ${updated} image(s) updated. Orders and reviews were not touched.`);
  process.exit(0);
}

restoreImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
