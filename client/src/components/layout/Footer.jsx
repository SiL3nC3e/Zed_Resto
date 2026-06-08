import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-light border-t border-white/5">
      <div className="max-w-7xl mx-auto section-padding pb-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-2xl gold-text mb-4">ZED-RESTO</h3>
            <p className="font-serif text-lg text-cream/60 leading-relaxed italic">
              Where culinary artistry meets timeless elegance. An unforgettable dining experience
              awaits.
            </p>
          </div>

          <div>
            <h4 className="text-gold text-sm tracking-widest uppercase mb-6">Explore</h4>
            <div className="space-y-3">
              {[
                { to: '/menu', label: 'Our Menu' },
                { to: '/reservations', label: 'Reserve a Table' },
                { to: '/about', label: 'Our Story' },
                { to: '/login', label: 'Member Login' },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-cream/60 hover:text-gold transition-colors text-sm"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold text-sm tracking-widest uppercase mb-6">Visit Us</h4>
            <div className="space-y-4 text-cream/60 text-sm">
              <p className="flex items-start gap-3">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                42 Rue de la Gastronomie, Paris 75008
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} className="text-gold shrink-0" />
                +33 1 42 86 00 00
              </p>
              <p className="flex items-center gap-3">
                <Mail size={16} className="text-gold shrink-0" />
                reservations@zedresto.com
              </p>
              <p className="flex items-start gap-3">
                <Clock size={16} className="text-gold mt-0.5 shrink-0" />
                Tue–Sun: 12:00 – 14:30 & 19:00 – 23:00
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-cream/40 text-xs tracking-wider">
          <p>&copy; {new Date().getFullYear()} Zed-Resto. All rights reserved.</p>
          <p className="font-serif italic">Crafted with passion for the art of fine dining.</p>
        </div>
      </div>
    </footer>
  );
}
