import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isStaff } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const navigate = useNavigate();

  const links = [
    { to: '/menu', label: 'Menu' },
    { to: '/reservations', label: 'Reservations' },
    { to: '/about', label: 'About' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <Link to="/" className="font-display text-2xl tracking-widest gold-text">
          ZED-RESTO
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm tracking-widest uppercase transition-colors ${
                  isActive ? 'text-gold' : 'text-cream/70 hover:text-gold'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/cart" className="relative btn-ghost">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-charcoal text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {isStaff() && (
                <Link to="/admin" className="btn-ghost text-gold text-xs uppercase tracking-widest">
                  Dashboard
                </Link>
              )}
              <Link to="/profile" className="btn-ghost">
                <User size={18} />
                <span className="text-sm">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost" aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-outline text-xs py-2 px-4">
              Sign In
            </Link>
          )}
        </div>

        <button className="md:hidden text-cream" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-charcoal-light border-t border-white/5 px-6 py-6 space-y-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block text-sm tracking-widest uppercase text-cream/70 hover:text-gold py-2"
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/cart" onClick={() => setOpen(false)} className="block text-sm tracking-widest uppercase py-2">
            Cart ({itemCount})
          </Link>
          {user ? (
            <>
              {isStaff() && (
                <Link to="/admin" onClick={() => setOpen(false)} className="block text-gold text-sm py-2">
                  Dashboard
                </Link>
              )}
              <Link to="/profile" onClick={() => setOpen(false)} className="block text-sm py-2">
                Profile
              </Link>
              <button onClick={handleLogout} className="block text-sm py-2 text-cream/70">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="btn-primary w-full mt-4">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
