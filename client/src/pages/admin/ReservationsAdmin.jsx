import { useEffect, useState } from 'react';
import api from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = () => {
    api
      .get('/reservations/admin/all')
      .then(({ data }) => setReservations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchReservations(), []);

  const updateStatus = async (id, status) => {
    await api.patch(`/reservations/${id}/status`, { status });
    fetchReservations();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-cream mb-8">Reservations</h1>

      <div className="space-y-4">
        {reservations.length === 0 ? (
          <p className="text-cream/40">No reservations yet.</p>
        ) : (
          reservations.map((r) => (
            <div key={r._id} className="bg-charcoal-light border border-white/5 p-6">
              <div className="flex flex-wrap justify-between gap-4 mb-3">
                <div>
                  <p className="text-cream font-medium">
                    {r.guestInfo?.name || r.user?.name}
                  </p>
                  <p className="text-cream/40 text-sm">{r.guestInfo?.email}</p>
                  <p className="text-cream/40 text-sm">{r.guestInfo?.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold">
                    {new Date(r.date).toLocaleDateString()} at {r.time}
                  </p>
                  <p className="text-cream/50 text-sm">{r.partySize} guests</p>
                  <p className="text-cream/30 text-xs capitalize">
                    {r.seatingPreference.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              {r.specialRequests && (
                <p className="text-cream/50 text-sm italic mb-3">"{r.specialRequests}"</p>
              )}
              <select
                value={r.status}
                onChange={(e) => updateStatus(r._id, e.target.value)}
                className="input-luxury w-auto text-sm capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
