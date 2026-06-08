import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (['super_admin', 'manager', 'chef', 'waiter'].includes(data.user.role)) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      /* error handled in store */
    }
  };

  return (
    <div className="section-padding min-h-[70vh] flex items-center">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-cream mb-2">Welcome Back</h1>
          <p className="text-cream/50 font-serif italic">Sign in to your Zed-Resto account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-charcoal-light border border-white/5 p-8 space-y-6">
          <div>
            <label className="text-gold text-xs tracking-widest uppercase mb-2 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-luxury"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-gold text-xs tracking-widest uppercase mb-2 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-luxury"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-cream/50 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold hover:text-gold-light">
            Create one
          </Link>
        </p>

        <div className="mt-8 p-4 border border-white/5 text-cream/40 text-xs text-center">
          <p className="mb-2 text-gold/60 uppercase tracking-widest">Demo Accounts</p>
          <p>Admin: admin@zedresto.com / admin123</p>
          <p>Chef: chef@zedresto.com / chef123</p>
          <p>Guest: guest@zedresto.com / guest123</p>
        </div>
      </div>
    </div>
  );
}
