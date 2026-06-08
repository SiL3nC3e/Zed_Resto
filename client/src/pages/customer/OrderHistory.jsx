import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const STATUS_COLORS = {
  received: 'text-yellow-400',
  in_preparation: 'text-orange-400',
  ready: 'text-blue-400',
  out_for_delivery: 'text-purple-400',
  delivered: 'text-green-400',
  picked_up: 'text-green-400',
  cancelled: 'text-red-400',
};

export default function OrderHistory() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl text-cream mb-10">Order History</h1>

        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-serif italic text-cream/50 text-lg mb-6">No orders yet.</p>
            <Link to="/menu" className="btn-primary">Explore Menu</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-charcoal-light border border-white/5 p-6"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="font-display text-lg text-cream">{order.orderNumber}</p>
                    <p className="text-cream/40 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold font-display text-xl">${order.total.toFixed(2)}</p>
                    <p
                      className={`text-sm capitalize ${STATUS_COLORS[order.status] || 'text-cream/50'}`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-cream/60 text-sm">
                      {item.quantity}x {item.name} — ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
