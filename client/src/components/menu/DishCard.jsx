import { Link } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';

export default function DishCard({ dish }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-luxury group"
    >
      <Link to={`/menu/${dish._id}`} className="block relative overflow-hidden aspect-[4/3]">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60" />
        {dish.isFeatured && (
          <span className="absolute top-4 left-4 bg-gold text-charcoal text-xs px-3 py-1 tracking-widest uppercase font-medium">
            Signature
          </span>
        )}
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Link to={`/menu/${dish._id}`}>
            <h3 className="font-display text-lg text-cream group-hover:text-gold transition-colors">
              {dish.name}
            </h3>
          </Link>
          <span className="text-gold font-medium whitespace-nowrap">${dish.price}</span>
        </div>

        <p className="text-cream/50 text-sm line-clamp-2 mb-3 font-serif italic">
          {dish.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gold/80 text-sm">
            <Star size={14} fill="currentColor" />
            <span>{dish.rating.toFixed(1)}</span>
            <span className="text-cream/30">({dish.reviewCount})</span>
          </div>
          <button
            onClick={() => addItem(dish)}
            className="flex items-center gap-1 text-gold text-sm hover:text-gold-light transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {dish.dietaryTags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {dish.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-cream/40 border border-white/10 px-2 py-0.5 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
