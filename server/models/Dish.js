import mongoose from 'mongoose';

const CATEGORIES = ['starters', 'mains', 'desserts', 'drinks'];
const DIETARY_TAGS = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'halal'];

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    chefNotes: { type: String, default: '' },
    dietaryTags: [{ type: String, enum: DIETARY_TAGS }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Dish = mongoose.model('Dish', dishSchema);
export { CATEGORIES, DIETARY_TAGS };
