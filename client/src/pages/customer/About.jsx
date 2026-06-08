export default function About() {
  return (
    <div>
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://plus.unsplash.com/premium_photo-1681841594224-ad729a249113?q=80&w=754&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          }}
        />
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="relative z-10 text-center px-6">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">Est. 2018</p>
          <h1 className="font-display text-5xl md:text-6xl text-cream">Our Story</h1>
        </div>
      </section>

      <section className="section-padding max-w-4xl mx-auto">
        <div className="font-serif text-lg text-cream/70 leading-relaxed space-y-6 italic">
          <p>
            Zed-Resto was born from a singular vision: to create a dining destination where every
            detail — from the first amuse-bouche to the final digestif — reflects uncompromising
            excellence.
          </p>
          <p>
            Founded by culinary visionary Chef Laurent Dubois, our restaurant has earned acclaim
            for its innovative approach to classical French cuisine, reimagined through a global
            lens and executed with the precision of a Michelin-starred kitchen.
          </p>
          <p>
            Our 48-seat dining room, designed by renowned architect Isabella Moreau, features
            floor-to-ceiling windows overlooking the Seine, hand-blown Murano chandeliers, and
            bespoke furnishings crafted by Parisian artisans.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <img
            src="https://images.unsplash.com/photo-1661505300183-befeab79c3ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjEyfHxDaGVmJTIwTGF1cmVudHxlbnwwfHwwfHx8MA%3D%3D"
            alt="Chef"
            className="w-full aspect-[4/5] object-cover"
          />
          <div className="flex flex-col justify-center">
            <p className="text-gold tracking-widest uppercase text-sm mb-4">Executive Chef</p>
            <h2 className="font-display text-3xl text-cream mb-4">Chef Laurent Dubois</h2>
            <p className="text-cream/60 leading-relaxed">
              With two Michelin stars and three decades of experience across Lyon, Tokyo, and New
              York, Chef Laurent brings a rare depth of knowledge to every plate. His philosophy:
              respect the ingredient, honor the tradition, then dare to innovate.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
