import { useState } from 'react';
import { CheckCircle, Calendar, Users, Clock } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import PageHero from '../../components/ui/PageHero';

export default function Reservations() {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    date: '',
    time: '',
    partySize: 2,
    seatingPreference: 'no_preference',
    specialRequests: '',
    guestInfo: { name: '', email: '', phone: '' },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/reservations', form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Reservation failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-charcoal/85" />
        <div className="relative z-10 section-padding text-center max-w-lg mx-auto">
          <CheckCircle size={64} className="text-gold mx-auto mb-6" />
          <h1 className="font-display text-4xl text-cream mb-4">Reservation Requested</h1>
          <p className="font-serif italic text-cream/60 mb-4">
            Thank you. Our concierge team will confirm your table within the hour.
          </p>
          <p className="text-cream/40 text-sm">
            A confirmation email will be sent to your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
        label="An Evening Awaits"
        title="Reserve a Table"
        subtitle="Secure your seat at our exclusive dining room. Tables are held for 15 minutes past reservation time."
        height="h-[50vh] min-h-[360px]"
      />

      <div className="section-padding bg-charcoal">
        <div className="max-w-3xl mx-auto -mt-8 relative z-10">
          <form
            onSubmit={handleSubmit}
            className="bg-charcoal-light border border-white/10 shadow-2xl shadow-black/40 p-8 md:p-12 space-y-8"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center gap-2 text-gold text-xs tracking-widest uppercase mb-3">
                  <Calendar size={14} /> Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-luxury"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-gold text-xs tracking-widest uppercase mb-3">
                  <Clock size={14} /> Time
                </label>
                <select
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="input-luxury"
                >
                  <option value="">Select time</option>
                  {['12:00', '12:30', '13:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-gold text-xs tracking-widest uppercase mb-3">
                  <Users size={14} /> Party Size
                </label>
                <select
                  value={form.partySize}
                  onChange={(e) => setForm({ ...form, partySize: Number(e.target.value) })}
                  className="input-luxury"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} guest{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-gold text-xs tracking-widest uppercase mb-3 block">
                Seating Preference
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'no_preference', label: 'No Preference' },
                  { value: 'window', label: 'Window' },
                  { value: 'outdoor', label: 'Terrace' },
                  { value: 'indoor', label: 'Main Dining' },
                  { value: 'private', label: 'Private Room' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, seatingPreference: opt.value })}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      form.seatingPreference === opt.value
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-white/10 text-cream/50 hover:border-gold/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {!user && (
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  required
                  placeholder="Full Name"
                  value={form.guestInfo.name}
                  onChange={(e) =>
                    setForm({ ...form, guestInfo: { ...form.guestInfo, name: e.target.value } })
                  }
                  className="input-luxury"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.guestInfo.email}
                  onChange={(e) =>
                    setForm({ ...form, guestInfo: { ...form.guestInfo, email: e.target.value } })
                  }
                  className="input-luxury"
                />
                <input
                  required
                  placeholder="Phone"
                  value={form.guestInfo.phone}
                  onChange={(e) =>
                    setForm({ ...form, guestInfo: { ...form.guestInfo, phone: e.target.value } })
                  }
                  className="input-luxury"
                />
              </div>
            )}

            <div>
              <label className="text-gold text-xs tracking-widest uppercase mb-3 block">
                Special Requests
              </label>
              <textarea
                rows={3}
                placeholder="Allergies, celebrations, accessibility needs..."
                value={form.specialRequests}
                onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                className="input-luxury resize-none"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Submitting...' : 'Request Reservation'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
