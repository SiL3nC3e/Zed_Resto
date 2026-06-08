import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ROLES = ['customer', 'waiter', 'chef', 'manager', 'super_admin'];

export default function Users() {
  const { isAdmin } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    api
      .get('/users')
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAdmin()) fetchUsers();
    else setLoading(false);
  }, [isAdmin]);

  if (!isAdmin()) return <Navigate to="/admin" replace />;

  const updateUser = async (id, updates) => {
    await api.put(`/users/${id}`, updates);
    fetchUsers();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-cream mb-8">User Management</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-cream/50 text-left">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Role</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-white/5">
                <td className="py-4 pr-4 text-cream">{user.name}</td>
                <td className="py-4 pr-4 text-cream/60">{user.email}</td>
                <td className="py-4 pr-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUser(user._id, { role: e.target.value })}
                    className="input-luxury text-xs w-auto capitalize"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4">
                  <button
                    onClick={() => updateUser(user._id, { isActive: !user.isActive })}
                    className={`text-xs px-3 py-1 ${
                      user.isActive
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-red-400/10 text-red-400'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
