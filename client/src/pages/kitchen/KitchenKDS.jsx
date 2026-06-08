import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Clock, ChefHat } from 'lucide-react';
import api from '../../lib/api';
import { connectSocket } from '../../lib/socket';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const STATUS_FLOW = {
  received: 'in_preparation',
  in_preparation: 'ready',
};

const STATUS_LABELS = {
  received: 'New Ticket',
  in_preparation: 'In Preparation',
  ready: 'Ready to Serve',
};

const STATUS_COLORS = {
  received: 'border-yellow-500/50 bg-yellow-500/5',
  in_preparation: 'border-orange-500/50 bg-orange-500/5',
  ready: 'border-green-500/50 bg-green-500/5',
};

export default function KitchenKDS() {
  const { user, isChef } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api
      .get('/orders/kitchen')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isChef()) return;
    fetchOrders();
    const socket = connectSocket();
    socket.emit('join_kitchen');
    socket.on('new_order', fetchOrders);
    socket.on('order_status_changed', fetchOrders);
    return () => {
      socket.off('new_order');
      socket.off('order_status_changed');
    };
  }, [isChef]);

  const advanceStatus = async (order) => {
    const next = STATUS_FLOW[order.status];
    if (!next) return;
    await api.patch(`/orders/${order._id}/status`, { status: next });
    fetchOrders();
  };

  if (!user || !isChef()) return <Navigate to="/login" replace />;
  if (loading) return <LoadingSpinner />;

  const grouped = {
    received: orders.filter((o) => o.status === 'received'),
    in_preparation: orders.filter((o) => o.status === 'in_preparation'),
    ready: orders.filter((o) => o.status === 'ready'),
  };

  return (
    <div className="min-h-screen bg-charcoal p-6">
      <div className="flex items-center gap-3 mb-8">
        <ChefHat size={28} className="text-gold" />
        <h1 className="font-display text-3xl text-cream">Kitchen Display</h1>
        <span className="ml-auto text-cream/40 text-sm flex items-center gap-2">
          <Clock size={14} />
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([status, tickets]) => (
          <div key={status}>
            <h2 className="text-gold text-sm tracking-widest uppercase mb-4">
              {STATUS_LABELS[status]} ({tickets.length})
            </h2>
            <div className="space-y-4">
              {tickets.map((order) => (
                <div
                  key={order._id}
                  className={`border-2 p-5 ${STATUS_COLORS[status]}`}
                >
                  <div className="flex justify-between mb-3">
                    <p className="font-display text-lg text-cream">{order.orderNumber}</p>
                    <span className="text-cream/40 text-xs capitalize">
                      {order.orderType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-cream font-medium">
                          {item.quantity}x {item.name}
                        </span>
                        {item.notes && (
                          <span className="text-orange-400 text-xs">{item.notes}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-cream/30 text-xs mb-3">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                  {STATUS_FLOW[order.status] && (
                    <button
                      onClick={() => advanceStatus(order)}
                      className="btn-primary w-full justify-center text-xs py-2"
                    >
                      Mark as {STATUS_FLOW[order.status].replace(/_/g, ' ')}
                    </button>
                  )}
                </div>
              ))}
              {tickets.length === 0 && (
                <p className="text-cream/30 text-sm text-center py-8">No tickets</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
