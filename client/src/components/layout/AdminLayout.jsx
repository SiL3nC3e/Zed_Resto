import { NavLink, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  CalendarDays,
  Users,
  ChefHat,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  {
    to: '/admin/menu',
    label: 'Menu',
    icon: UtensilsCrossed,
    roles: ['super_admin', 'manager', 'chef'],
  },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  {
    to: '/admin/reservations',
    label: 'Reservations',
    icon: CalendarDays,
    roles: ['super_admin', 'manager', 'waiter'],
  },
  { to: '/admin/users', label: 'Users', icon: Users, roles: ['super_admin', 'manager'] },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, roles: ['super_admin', 'manager'] },
  {
    to: '/kitchen',
    label: 'Kitchen KDS',
    icon: ChefHat,
    roles: ['super_admin', 'manager', 'chef'],
  },
];

export default function AdminLayout() {
  const { user, isStaff } = useAuthStore();

  if (!user || !isStaff()) return <Navigate to="/login" replace />;

  const visibleNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-charcoal flex">
      <aside className="w-64 bg-charcoal-light border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <NavLink to="/" className="flex items-center gap-2 text-cream/50 hover:text-gold text-sm mb-4">
            <ArrowLeft size={16} />
            Back to site
          </NavLink>
          <h1 className="font-display text-xl gold-text">Zed Admin</h1>
          <p className="text-cream/40 text-xs mt-1 capitalize">{user.role.replace('_', ' ')}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {visibleNav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-gold/10 text-gold border-l-2 border-gold'
                    : 'text-cream/60 hover:text-cream hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
