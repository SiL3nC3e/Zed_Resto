import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Plus, Minus, ArrowLeft, AlertCircle, MessageSquare } from 'lucide-react';
import api from '../../lib/api';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import StarRating from '../../components/reviews/StarRating';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function DishDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [dish, setDish] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const fetchDish = useCallback(() => {
    return api.get(`/menu/${id}`).then(({ data }) => setDish(data));
  }, [id]);

  const fetchReviews = useCallback(() => {
    return api.get(`/reviews/dish/${id}`).then(({ data }) => setReviews(data));
  }, [id]);

  useEffect(() => {
    Promise.all([fetchDish(), fetchReviews()])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchDish, fetchReviews]);

  useEffect(() => {
    const mine = reviews.find((r) => r.user?._id === user?.id);
    if (mine) {
      setRating(mine.rating);
      setComment(mine.comment || '');
    }
  }, [reviews, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess(false);
    try {
      const { data } = await api.post('/reviews', { dishId: id, rating, comment });
      setDish((prev) => ({
        ...prev,
        rating: data.rating,
        reviewCount: data.reviewCount,
      }));
      await fetchReviews();
      setReviewSuccess(true);
      setComment('');
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const userReview = reviews.find((r) => r.user?._id === user?.id);

  if (loading) return <LoadingSpinner />;
  if (!dish) {
    return (
      <div className="section-padding text-center">
        <p className="text-cream/50">Dish not found.</p>
        <Link to="/menu" className="btn-ghost text-gold mt-4 inline-flex">
          <ArrowLeft size={16} /> Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="max-w-6xl mx-auto">
        <Link to="/menu" className="btn-ghost text-gold mb-8 inline-flex">
          <ArrowLeft size={16} /> Back to Menu
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="relative aspect-square overflow-hidden">
            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 border border-gold/20" />
          </div>

          <div>
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-2 capitalize">
              {dish.category}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">{dish.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-gold">
                <Star size={18} fill="currentColor" />
                <span className="text-lg">{dish.rating.toFixed(1)}</span>
              </div>
              <span className="text-cream/40">({dish.reviewCount} reviews)</span>
              <span className="text-2xl text-gold font-display ml-auto">${dish.price}</span>
            </div>

            <p className="font-serif text-lg text-cream/70 italic leading-relaxed mb-8">
              {dish.description}
            </p>

            {dish.chefNotes && (
              <div className="bg-charcoal-light border-l-2 border-gold p-5 mb-8">
                <p className="text-gold text-xs tracking-widest uppercase mb-2">Chef's Note</p>
                <p className="font-serif italic text-cream/70">{dish.chefNotes}</p>
              </div>
            )}

            {dish.ingredients?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-gold text-xs tracking-widest uppercase mb-3">Ingredients</h3>
                <p className="text-cream/60 text-sm">{dish.ingredients.join(' · ')}</p>
              </div>
            )}

            {dish.allergens?.length > 0 && (
              <div className="flex items-start gap-2 mb-8 text-cream/50 text-sm">
                <AlertCircle size={16} className="text-gold shrink-0 mt-0.5" />
                <span>Contains: {dish.allergens.join(', ')}</span>
              </div>
            )}

            {dish.dietaryTags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {dish.dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs border border-gold/30 text-gold px-3 py-1 capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/10">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-cream/60 hover:text-gold"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 text-cream">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-cream/60 hover:text-gold"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={() => addItem(dish, quantity)} className="btn-primary flex-1">
                Add to Order — ${(dish.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="border-t border-white/10 pt-12">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare size={24} className="text-gold" />
            <h2 className="font-display text-3xl text-cream">Guest Reviews</h2>
            <span className="text-cream/40 text-sm ml-auto">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <div className="bg-charcoal-light border border-white/5 p-6 sticky top-28">
                <h3 className="text-gold text-sm tracking-widest uppercase mb-4">
                  {userReview ? 'Update Your Review' : 'Write a Review'}
                </h3>

                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="text-cream/50 text-xs mb-2 block">Your rating</label>
                      <StarRating
                        value={userReview?.rating ?? rating}
                        onChange={setRating}
                        size={24}
                      />
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Share your dining experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="input-luxury resize-none text-sm"
                    />
                    {reviewError && <p className="text-red-400 text-xs">{reviewError}</p>}
                    {reviewSuccess && (
                      <p className="text-green-400 text-xs">Review submitted — thank you!</p>
                    )}
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="btn-primary w-full justify-center text-xs"
                    >
                      {reviewLoading
                        ? 'Submitting...'
                        : userReview
                          ? 'Update Review'
                          : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-cream/50 text-sm mb-4">
                      Sign in to rate and review this dish.
                    </p>
                    <Link to="/login" className="btn-outline text-xs py-2 w-full justify-center">
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <p className="font-serif italic text-cream/40 text-center py-12">
                  No reviews yet — be the first to share your experience.
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-charcoal-light border border-white/5 p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-cream font-medium">{review.user?.name || 'Guest'}</p>
                        <p className="text-cream/30 text-xs">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <StarRating value={review.rating} readonly size={16} />
                    </div>
                    {review.comment && (
                      <p className="text-cream/60 text-sm leading-relaxed font-serif italic">
                        "{review.comment}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
