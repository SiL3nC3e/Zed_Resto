import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import api from '../../lib/api';
import DishCard from '../../components/menu/DishCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/menu?featured=true')
      .then(({ data }) => setFeatured(data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/30" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <p className="text-gold tracking-[0.4em] uppercase text-sm mb-6">Fine Dining Experience</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream mb-6 leading-tight">
            Taste the
            <br />
            <span className="gold-text italic">Extraordinary</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-cream/70 mb-10 max-w-2xl mx-auto italic">
            A symphony of flavors crafted by award-winning chefs in an atmosphere of refined elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservations" className="btn-primary">
              Reserve a Table
              <ArrowRight size={18} />
            </Link>
            <Link to="/menu" className="btn-outline">
              Explore Menu
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/40">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent" />
        </div>
      </section>

      <section className="section-padding bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">Our Philosophy</p>
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-6">
              Culinary Artistry
            </h2>
            <p className="font-serif text-lg text-cream/60 max-w-2xl mx-auto italic leading-relaxed">
              Every dish tells a story — of heritage ingredients, meticulous technique, and the
              passion of chefs who believe dining is an art form.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Seasonal Ingredients',
                desc: 'We source the finest produce from local artisans and international purveyors.',
                img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
              },
              {
                title: 'Master Chefs',
                desc: 'Led by Chef Laurent, our kitchen team brings decades of Michelin-starred experience.',
                img: 'https://images.unsplash.com/photo-1661505300183-befeab79c3ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjEyfHxDaGVmJTIwTGF1cmVudHxlbnwwfHwwfHx8MA%3D%3D',
              },
              {
                title: 'Impeccable Service',
                desc: 'White-glove hospitality that anticipates your every need without intrusion.',
                img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-luxury"
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-gold mb-3">{item.title}</h3>
                  <p className="text-cream/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-light">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">Chef's Selection</p>
              <h2 className="font-display text-4xl text-cream">Signature Dishes</h2>
            </div>
            <Link to="/menu" className="btn-ghost text-gold">
              View Full Menu <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featured.map((dish) => (
                <DishCard key={dish._id} dish={dish} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-charcoal/80" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-gold" fill="currentColor" />
            ))}
          </div>
          <blockquote className="font-serif text-2xl md:text-3xl text-cream italic leading-relaxed mb-8">
            "An evening at Zed-Resto is not merely dinner — it is a journey through the senses
            that lingers long after the last course."
          </blockquote>
          <cite className="text-gold text-sm tracking-widest uppercase not-italic">
            — The Gastronome Review, 2025
          </cite>
        </div>
      </section>

      <section className="section-padding bg-charcoal text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl text-cream mb-6">Reserve Your Experience</h2>
          <p className="text-cream/60 mb-8">
            Tables are limited. Secure your evening of exceptional dining today.
          </p>
          <Link to="/reservations" className="btn-primary">
            Book Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
