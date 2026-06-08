import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, total, promoCode, discount, setPromo, clearCart, validateCart } =
    useCartStore();
  const { user } = useAuthStore();
  const [orderType, setOrderType] = useState('delivery');
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    zip: '',
    instructions: '',
  });
  const [promoInput, setPromoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    validateCart().then((result) => {
      if (result?.removed?.length) {
        setError(
          `Some items were removed (no longer on menu): ${result.removed.join(', ')}. Please review your cart.`
        );
      }
      setCartReady(true);
    });
  }, [validateCart]);

  if (!cartReady && !success) {
    return (
      <div className="section-padding text-center text-cream/50">Preparing checkout...</div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="section-padding text-center">
        <p className="text-cream/50 mb-4">Nothing to checkout.</p>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  const applyPromo = async () => {
    try {
      const { data } = await api.post('/promotions/validate', {
        code: promoInput,
        subtotal: subtotal(),
      });
      setPromo(data.code, data.discount);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid promo code');
      setPromo('', 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const validation = await validateCart();
      if (!validation?.items?.length) {
        setError('Your cart is empty or contains unavailable items. Please add dishes from the menu.');
        return;
      }
      const currentItems = useCartStore.getState().items;
      const payload = {
        items: currentItems.map((i) => ({
          dishId: i.dishId,
          quantity: i.quantity,
          notes: i.notes,
        })),
        orderType,
        promoCode: promoCode || undefined,
        ...(orderType === 'delivery' && { deliveryAddress }),
        ...(!user && { guestInfo }),
      };
      const { data } = await api.post('/orders', payload);
      clearCart();
      setSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="section-padding text-center max-w-lg mx-auto">
        <CheckCircle size={64} className="text-gold mx-auto mb-6" />
        <h1 className="font-display text-4xl text-cream mb-4">Order Confirmed</h1>
        <p className="text-cream/60 mb-2">Order #{success.orderNumber}</p>
        <p className="font-serif italic text-cream/50 mb-8">
          Thank you for dining with Zed-Resto. Your culinary journey begins shortly.
        </p>
        <div className="flex gap-4 justify-center">
          {user && (
            <button onClick={() => navigate('/orders')} className="btn-outline">
              View Orders
            </button>
          )}
          <button onClick={() => navigate('/menu')} className="btn-primary">
            Continue Browsing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl text-cream mb-10">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="text-gold text-sm tracking-widest uppercase mb-4">Order Type</h2>
              <div className="flex gap-3">
                {['delivery', 'pickup', 'dine_in'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`px-4 py-2 text-sm capitalize tracking-wide border transition-colors ${
                      orderType === type
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-white/10 text-cream/50 hover:border-gold/30'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {!user && (
              <div>
                <h2 className="text-gold text-sm tracking-widest uppercase mb-4">Your Details</h2>
                <div className="grid gap-4">
                  <input
                    required
                    placeholder="Full Name"
                    value={guestInfo.name}
                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    className="input-luxury"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    className="input-luxury"
                  />
                  <input
                    placeholder="Phone"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                    className="input-luxury"
                  />
                </div>
              </div>
            )}

            {orderType === 'delivery' && (
              <div>
                <h2 className="text-gold text-sm tracking-widest uppercase mb-4">Delivery Address</h2>
                <div className="grid gap-4">
                  <input
                    required
                    placeholder="Street Address"
                    value={deliveryAddress.street}
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                    }
                    className="input-luxury"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                      }
                      className="input-luxury"
                    />
                    <input
                      required
                      placeholder="ZIP"
                      value={deliveryAddress.zip}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, zip: e.target.value })
                      }
                      className="input-luxury"
                    />
                  </div>
                  <input
                    placeholder="Delivery instructions (optional)"
                    value={deliveryAddress.instructions}
                    onChange={(e) =>
                      setDeliveryAddress({ ...deliveryAddress, instructions: e.target.value })
                    }
                    className="input-luxury"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-charcoal-light border border-white/5 p-6 sticky top-28">
              <h2 className="font-display text-xl text-cream mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.dishId} className="flex justify-between text-sm">
                    <span className="text-cream/70">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-cream">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-6">
                <input
                  placeholder="Promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  className="input-luxury flex-1 text-sm"
                />
                <button type="button" onClick={applyPromo} className="btn-outline text-xs px-4 py-2">
                  Apply
                </button>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-cream/60 text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal().toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400 text-sm">
                    <span>Discount ({promoCode})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-cream font-display text-lg">
                  <span>Total</span>
                  <span className="text-gold">${total().toFixed(2)}</span>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Processing...' : `Place Order — $${total().toFixed(2)}`}
              </button>

              <p className="text-cream/30 text-xs text-center mt-4">
                Try promo code: WELCOME15
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
