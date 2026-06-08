import { Star } from 'lucide-react';

export default function StarRating({ value, onChange, size = 20, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className={`transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${star <= value ? 'text-gold' : 'text-cream/20'}`}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star size={size} fill={star <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}
