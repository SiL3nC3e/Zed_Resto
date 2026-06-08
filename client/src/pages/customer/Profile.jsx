import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Award } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const DIETARY_OPTIONS = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'halal', 'nut-free'];

export default function Profile() {
  const { user, fetchMe } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dietaryPreferences: user?.dietaryPreferences || [],
  });
  const [saved, setSaved] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const toggleDietary = (tag) => {
    setForm((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(tag)
        ? prev.dietaryPreferences.filter((t) => t !== tag)
        : [...prev.dietaryPreferences, tag],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await api.put('/auth/profile', form);
    await fetchMe();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-4xl text-cream mb-2">My Profile</h1>
        <p className="text-cream/50 mb-10">{user.email}</p>

        <div className="bg-charcoal-light border border-gold/20 p-6 mb-8 flex items-center gap-4">
          <Award size={32} className="text-gold" />
          <div>
            <p className="text-gold text-sm tracking-widest uppercase">Loyalty Points</p>
            <p className="font-display text-3xl text-cream">{user.loyaltyPoints || 0}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-charcoal-light border border-white/5 p-8 space-y-6">
          <div>
            <label className="text-gold text-xs tracking-widest uppercase mb-2 block">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-luxury"
            />
          </div>
          <div>
            <label className="text-gold text-xs tracking-widest uppercase mb-2 block">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-luxury"
            />
          </div>
          <div>
            <label className="text-gold text-xs tracking-widest uppercase mb-3 block">
              Dietary Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleDietary(tag)}
                  className={`text-xs px-3 py-1.5 capitalize border transition-colors ${
                    form.dietaryPreferences.includes(tag)
                      ? 'border-gold text-gold bg-gold/10'
                      : 'border-white/10 text-cream/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary">
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
