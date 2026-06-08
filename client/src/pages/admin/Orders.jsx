import { useEffect, useState } from 'react';
import api from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const STATUSES = [
  'received',
  'in_preparation',
  'ready',
  'out_for_delivery',
  'delivered',
  'picked_up',
  'cancelled',
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = () => {
    const params = filter ? `?status=${filter}` : '';
    api
      .get(`/orders/admin/all${params}`)
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, [filter]);

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="font-display text-3xl text-cream">Order Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-luxury w-auto text-sm"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-cream/40">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-charcoal-light border border-white/5 p-6">
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <p className="font-display text-lg text-cream">{order.orderNumber}</p>
                  <p className="text-cream/40 text-sm">
                    {order.user?.name || order.guestInfo?.name || 'Guest'} ·{' '}
                    <span className="capitalize">{order.orderType.replace('_', ' ')}</span>
                  </p>
                  <p className="text-cream/30 text-xs">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-gold font-display text-xl">${order.total.toFixed(2)}</p>
              </div>

              <div className="mb-4 space-y-1">
                {order.items.map((item, i) => (
                  <p key={i} className="text-cream/60 text-sm">
                    {item.quantity}x {item.name}
                  </p>
                ))}
              </div>

              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="input-luxury w-auto text-sm capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
