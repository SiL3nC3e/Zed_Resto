export default function PageHero({ image, label, title, subtitle, height = 'h-[45vh] min-h-[320px]' }) {
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-charcoal/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-charcoal/40" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        {label && (
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">{label}</p>
        )}
        <h1 className="font-display text-4xl md:text-6xl text-cream mb-4">{title}</h1>
        {subtitle && (
          <p className="font-serif text-lg md:text-xl text-cream/70 italic">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
