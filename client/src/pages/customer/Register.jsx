import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch {
      /* error handled in store */
    }
  };

  return (
    <div className="section-padding min-h-[70vh] flex items-center">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-cream mb-2">Join Zed-Resto</h1>
          <p className="text-cream/50 font-serif italic">Create an account and earn loyalty rewards</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-charcoal-light border border-white/5 p-8 space-y-6">
          {['name', 'email', 'password', 'phone'].map((field) => (
            <div key={field}>
              <label className="text-gold text-xs tracking-widest uppercase mb-2 block">
                {field === 'name' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                required={field !== 'phone'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="input-luxury"
              />
            </div>
          ))}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-cream/50 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:text-gold-light">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
