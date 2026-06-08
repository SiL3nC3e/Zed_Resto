import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../../lib/api';
import DishCard from '../../components/menu/DishCard';
import PageHero from '../../components/ui/PageHero';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'starters', label: 'Starters' },
  { value: 'mains', label: 'Mains' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'drinks', label: 'Drinks' },
];

const DIETARY = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'halal'];

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [dietary, setDietary] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (dietary.length) params.set('dietary', dietary.join(','));
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRating) params.set('minRating', minRating);

    setLoading(true);
    api
      .get(`/menu?${params}`)
      .then(({ data }) => setDishes(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, search, dietary, minPrice, maxPrice, minRating]);

  const toggleDietary = (tag) => {
    setDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
        label="Curated Selection"
        title="Our Menu"
        subtitle="Each dish is a masterpiece, crafted with the finest ingredients and unwavering attention to detail."
      />

      <div className="section-padding bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-5 py-2 text-sm tracking-widest uppercase transition-all ${
                  category === c.value
                    ? 'bg-gold text-charcoal'
                    : 'border border-white/10 text-cream/60 hover:border-gold/40 hover:text-gold'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-luxury pl-11"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center gap-2"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-charcoal-light border border-white/5 p-6 mb-8 grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-gold text-xs tracking-widest uppercase mb-3 block">
                  Dietary
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleDietary(tag)}
                      className={`text-xs px-3 py-1.5 capitalize border transition-colors ${
                        dietary.includes(tag)
                          ? 'border-gold text-gold bg-gold/10'
                          : 'border-white/10 text-cream/50 hover:border-gold/30'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gold text-xs tracking-widest uppercase mb-3 block">
                  Price Range
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="input-luxury"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="input-luxury"
                  />
                </div>
              </div>
              <div>
                <label className="text-gold text-xs tracking-widest uppercase mb-3 block">
                  Min Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="input-luxury"
                >
                  <option value="">Any</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.8">4.8+ Stars</option>
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : dishes.length === 0 ? (
            <p className="text-center text-cream/50 py-20 font-serif italic text-lg">
              No dishes match your criteria.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dishes.map((dish) => (
                <DishCard key={dish._id} dish={dish} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
