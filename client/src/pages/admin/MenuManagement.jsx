import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EMPTY_DISH = {
  name: '',
  description: '',
  category: 'starters',
  price: 0,
  image: '',
  ingredients: '',
  allergens: '',
  chefNotes: '',
  dietaryTags: [],
  isFeatured: false,
  isAvailable: true,
};

export default function MenuManagement() {
  const { isAdmin, isChef } = useAuthStore();
  const canEdit = isAdmin();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_DISH);

  const fetchDishes = () => {
    setLoading(true);
    api
      .get('/menu/admin/all')
      .then(({ data }) => setDishes(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load menu'))
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchDishes(), []);

  const toggleAvailability = async (dish) => {
    await api.patch(`/menu/${dish._id}/availability`, {
      isAvailable: !dish.isAvailable,
    });
    fetchDishes();
  };

  const openCreate = () => {
    setForm(EMPTY_DISH);
    setModal('create');
  };

  const openEdit = (dish) => {
    setForm({
      ...dish,
      ingredients: dish.ingredients?.join(', ') || '',
      allergens: dish.allergens?.join(', ') || '',
    });
    setModal(dish._id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      allergens: form.allergens.split(',').map((s) => s.trim()).filter(Boolean),
    };
    if (modal === 'create') {
      await api.post('/menu', payload);
    } else {
      await api.put(`/menu/${modal}`, payload);
    }
    setModal(null);
    fetchDishes();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this dish?')) return;
    await api.delete(`/menu/${id}`);
    fetchDishes();
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl text-cream">
            {canEdit ? 'Menu Management' : 'Menu — Kitchen View'}
          </h1>
          {isChef() && (
            <p className="text-cream/50 text-sm mt-2">
              View dishes and mark items in or out of stock. Contact a manager to edit menu details.
            </p>
          )}
        </div>
        {canEdit && (
          <button onClick={openCreate} className="btn-primary text-xs py-2">
            <Plus size={16} /> Add Dish
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-cream/50 text-left">
              <th className="pb-3 pr-4">Dish</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr key={dish._id} className="border-b border-white/5">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <img src={dish.image} alt="" className="w-10 h-10 object-cover" />
                    <span className="text-cream">{dish.name}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 capitalize text-cream/60">{dish.category}</td>
                <td className="py-4 pr-4 text-gold">${dish.price}</td>
                <td className="py-4 pr-4">
                  <button
                    onClick={() => toggleAvailability(dish)}
                    className={`text-xs px-2 py-1 transition-colors ${
                      dish.isAvailable
                        ? 'bg-green-400/10 text-green-400 hover:bg-green-400/20'
                        : 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                    }`}
                  >
                    {dish.isAvailable ? 'Available' : 'Out of Stock'}
                  </button>
                </td>
                <td className="py-4">
                  {canEdit ? (
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(dish)} className="text-cream/50 hover:text-gold">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(dish._id)} className="text-cream/50 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-cream/30 text-xs">View only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && canEdit && (
        <div className="fixed inset-0 bg-charcoal/80 z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal-light border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl text-cream">
                {modal === 'create' ? 'Add Dish' : 'Edit Dish'}
              </h2>
              <button onClick={() => setModal(null)} className="text-cream/50 hover:text-cream">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                ['name', 'Name'],
                ['description', 'Description'],
                ['image', 'Image URL'],
                ['chefNotes', "Chef's Notes"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-gold text-xs uppercase tracking-widest mb-1 block">
                    {label}
                  </label>
                  <input
                    required={key === 'name' || key === 'description'}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input-luxury text-sm"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gold text-xs uppercase tracking-widest mb-1 block">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-luxury text-sm"
                  >
                    {['starters', 'mains', 'desserts', 'drinks'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gold text-xs uppercase tracking-widest mb-1 block">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input-luxury text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-gold text-xs uppercase tracking-widest mb-1 block">
                  Ingredients (comma-separated)
                </label>
                <input
                  value={form.ingredients}
                  onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                  className="input-luxury text-sm"
                />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                Save Dish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
