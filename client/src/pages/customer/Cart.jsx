import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, AlertTriangle } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, total, itemCount, validateCart } =
    useCartStore();
  const [removedNotice, setRemovedNotice] = useState([]);

  useEffect(() => {
    validateCart().then((result) => {
      if (result?.removed?.length) setRemovedNotice(result.removed);
    });
  }, [validateCart]);

  if (items.length === 0) {
    return (
      <div className="section-padding text-center">
        <h1 className="font-display text-4xl text-cream mb-4">Your Cart</h1>
        <p className="font-serif italic text-cream/50 text-lg mb-8">
          {removedNotice.length
            ? 'Outdated items were removed from your cart after a menu update.'
            : 'Your cart is empty.'}
        </p>
        <Link to="/menu" className="btn-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl text-cream mb-2">Your Cart</h1>
        <p className="text-cream/50 mb-6">{itemCount()} item{itemCount() !== 1 ? 's' : ''}</p>

        {removedNotice.length > 0 && (
          <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/30 p-4 mb-6 text-sm text-orange-200">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <p>
              Removed unavailable items: {removedNotice.join(', ')}. Prices have been refreshed
              from the current menu.
            </p>
          </div>
        )}

        <div className="space-y-4 mb-10">
          {items.map((item) => (
            <div
              key={item.dishId}
              className="flex gap-4 bg-charcoal-light border border-white/5 p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-display text-lg text-cream">{item.name}</h3>
                <p className="text-gold">${item.price.toFixed(2)} each</p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                    className="text-cream/50 hover:text-gold"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-cream w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                    className="text-cream/50 hover:text-gold"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right flex flex-col justify-between">
                <button
                  onClick={() => removeItem(item.dishId)}
                  className="text-cream/30 hover:text-red-400 ml-auto"
                >
                  <Trash2 size={18} />
                </button>
                <p className="text-gold font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 space-y-3 mb-8">
          <div className="flex justify-between text-cream/60">
            <span>Subtotal</span>
            <span>${subtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-cream text-lg font-display">
            <span>Total</span>
            <span className="text-gold">${total().toFixed(2)}</span>
          </div>
        </div>

        <Link to="/checkout" className="btn-primary w-full justify-center">
          Proceed to Checkout
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
