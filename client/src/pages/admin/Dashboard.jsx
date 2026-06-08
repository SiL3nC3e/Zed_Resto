import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, CalendarDays, UtensilsCrossed, ChefHat, Clock } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Dashboard() {
  const { user, isAdmin, isChef } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (isAdmin()) {
          const [analytics, ordersRes, reservationsRes] = await Promise.all([
            api.get('/users/analytics'),
            api.get('/orders/admin/all'),
            api.get('/reservations/admin/all?status=pending'),
          ]);
          setStats(analytics.data);
          setOrders(ordersRes.data.slice(0, 5));
          setReservations(reservationsRes.data.slice(0, 5));
        } else if (isChef()) {
          const [kitchenRes, ordersRes] = await Promise.all([
            api.get('/orders/kitchen'),
            api.get('/orders/admin/all'),
          ]);
          setKitchenOrders(kitchenRes.data);
          setOrders(ordersRes.data.slice(0, 5));
        } else {
          // Waiter / floor staff
          const [ordersRes, reservationsRes] = await Promise.all([
            api.get('/orders/admin/all'),
            api.get('/reservations/admin/all?status=pending'),
          ]);
          setOrders(ordersRes.data.slice(0, 5));
          setReservations(reservationsRes.data.slice(0, 5));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user, isAdmin, isChef]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (isChef()) {
    const activeKitchen = kitchenOrders.filter((o) =>
      ['received', 'in_preparation'].includes(o.status)
    ).length;
    const readyCount = kitchenOrders.filter((o) => o.status === 'ready').length;

    const cards = [
      { label: 'Kitchen Queue', value: activeKitchen, icon: ChefHat, color: 'text-orange-400' },
      { label: 'Ready to Serve', value: readyCount, icon: Clock, color: 'text-green-400' },
      { label: 'Total Active Tickets', value: kitchenOrders.length, icon: ShoppingBag, color: 'text-gold' },
      { label: 'Recent Orders', value: orders.length, icon: UtensilsCrossed, color: 'text-blue-400' },
    ];

    return (
      <div className="p-8">
        <h1 className="font-display text-3xl text-cream mb-2">Kitchen Overview</h1>
        <p className="text-cream/50 text-sm mb-8">Live service status for the kitchen team</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-charcoal-light border border-white/5 p-6">
              <Icon size={24} className={`${color} mb-4`} />
              <p className="text-cream/50 text-sm mb-1">{label}</p>
              <p className="font-display text-2xl text-cream">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-8">
          <Link to="/kitchen" className="btn-primary text-xs">
            Open Kitchen Display
          </Link>
          <Link to="/admin/orders" className="btn-outline text-xs">
            All Orders
          </Link>
        </div>

        <div>
          <h2 className="text-gold text-sm tracking-widest uppercase mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-cream/40 text-sm">No orders yet.</p>
            ) : (
              orders.map((o) => (
                <div key={o._id} className="bg-charcoal-light border border-white/5 p-4 flex justify-between">
                  <div>
                    <p className="text-cream text-sm">{o.orderNumber}</p>
                    <p className="text-cream/40 text-xs capitalize">{o.status.replace(/_/g, ' ')}</p>
                  </div>
                  <p className="text-cream/60 text-sm">{o.items?.length} item(s)</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  const cards = isAdmin()
    ? [
        {
          label: 'Total Revenue',
          value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
          icon: DollarSign,
          color: 'text-gold',
        },
        {
          label: 'Total Orders',
          value: stats?.orderCount || 0,
          icon: ShoppingBag,
          color: 'text-blue-400',
        },
        {
          label: 'Pending Reservations',
          value: reservations.length,
          icon: CalendarDays,
          color: 'text-purple-400',
        },
        {
          label: 'Top Dish',
          value: stats?.topDishes?.[0]?.name || '—',
          icon: UtensilsCrossed,
          color: 'text-green-400',
        },
      ]
    : [
        {
          label: 'Recent Orders',
          value: orders.length,
          icon: ShoppingBag,
          color: 'text-blue-400',
        },
        {
          label: 'Pending Reservations',
          value: reservations.length,
          icon: CalendarDays,
          color: 'text-purple-400',
        },
      ];

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-cream mb-8">
        {isAdmin() ? 'Dashboard Overview' : 'Floor Overview'}
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-charcoal-light border border-white/5 p-6">
            <Icon size={24} className={`${color} mb-4`} />
            <p className="text-cream/50 text-sm mb-1">{label}</p>
            <p className="font-display text-2xl text-cream truncate">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gold text-sm tracking-widest uppercase">Recent Orders</h2>
            <Link to="/admin/orders" className="text-cream/50 text-sm hover:text-gold">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-cream/40 text-sm">No orders yet.</p>
            ) : (
              orders.map((o) => (
                <div key={o._id} className="bg-charcoal-light border border-white/5 p-4 flex justify-between">
                  <div>
                    <p className="text-cream text-sm">{o.orderNumber}</p>
                    <p className="text-cream/40 text-xs capitalize">{o.status.replace(/_/g, ' ')}</p>
                  </div>
                  <p className="text-gold">${o.total.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {(isAdmin() || user?.role === 'waiter') && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gold text-sm tracking-widest uppercase">Pending Reservations</h2>
              <Link to="/admin/reservations" className="text-cream/50 text-sm hover:text-gold">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {reservations.length === 0 ? (
                <p className="text-cream/40 text-sm">No pending reservations.</p>
              ) : (
                reservations.map((r) => (
                  <div key={r._id} className="bg-charcoal-light border border-white/5 p-4">
                    <p className="text-cream text-sm">
                      {r.guestInfo?.name} — {r.partySize} guests
                    </p>
                    <p className="text-cream/40 text-xs">
                      {new Date(r.date).toLocaleDateString()} at {r.time}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
