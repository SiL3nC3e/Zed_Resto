import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Analytics() {
  const { isAdmin } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) return;
    api
      .get('/users/analytics')
      .then(({ data: d }) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin()) return <Navigate to="/admin" replace />;
  if (loading) return <LoadingSpinner />;

  const maxSales = Math.max(...(data?.topDishes?.map((d) => d.count) || [1]));
  const maxHour = Math.max(...(data?.peakHours?.map((h) => h.count) || [1]));

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-cream mb-8">Sales Analytics</h1>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-charcoal-light border border-white/5 p-8 text-center">
          <p className="text-cream/50 text-sm mb-2">Total Revenue</p>
          <p className="font-display text-5xl text-gold">
            ${data?.totalRevenue?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-charcoal-light border border-white/5 p-8 text-center">
          <p className="text-cream/50 text-sm mb-2">Total Orders</p>
          <p className="font-display text-5xl text-cream">{data?.orderCount || 0}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-charcoal-light border border-white/5 p-6">
          <h2 className="text-gold text-sm tracking-widest uppercase mb-6">Top Selling Dishes</h2>
          <div className="space-y-4">
            {(data?.topDishes || []).map((dish) => (
              <div key={dish.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cream">{dish.name}</span>
                  <span className="text-cream/50">{dish.count} sold</span>
                </div>
                <div className="h-2 bg-charcoal-muted">
                  <div
                    className="h-full bg-gold transition-all"
                    style={{ width: `${(dish.count / maxSales) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {!data?.topDishes?.length && (
              <p className="text-cream/40 text-sm">No sales data yet.</p>
            )}
          </div>
        </div>

        <div className="bg-charcoal-light border border-white/5 p-6">
          <h2 className="text-gold text-sm tracking-widest uppercase mb-6">Peak Service Hours</h2>
          <div className="space-y-4">
            {(data?.peakHours || []).map(({ hour, count }) => (
              <div key={hour}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cream">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                  <span className="text-cream/50">{count} orders</span>
                </div>
                <div className="h-2 bg-charcoal-muted">
                  <div
                    className="h-full bg-gold/70 transition-all"
                    style={{ width: `${(count / maxHour) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {!data?.peakHours?.length && (
              <p className="text-cream/40 text-sm">No peak hour data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
