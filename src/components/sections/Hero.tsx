import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pb-10 pt-8">
      {/* Scattered stars / decorative dots */}
      <span className="absolute top-4 left-6 text-xl opacity-40 rotate-12">✦</span>
      <span className="absolute top-12 right-8 text-sm opacity-30 -rotate-12">✦</span>
      <span className="absolute bottom-16 left-12 text-xs opacity-25 rotate-6">✦</span>

      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        {/* Logo / Profile image in polaroid frame */}
        <div className="polaroid mb-6 rotate-1">
          <div className="relative w-52 h-52 mx-auto">
            <Image
              src="/images/logo.jpg"
              alt="The Journal Vibes by Bel"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="font-script text-base text-charcoal mt-2 text-center">
            @vibesbybel ✨
          </p>
        </div>

        {/* Headline */}
        <div className="paper-torn max-w-xs mx-auto px-6 py-4 mb-4">
          <p className="font-script text-lg text-blush leading-tight">
            bienvenida a
          </p>
          <h1 className="font-serif text-4xl font-black text-charcoal uppercase tracking-tight leading-none">
            The Journal<br />Vibes
          </h1>
          <p className="font-script text-2xl text-charcoal">by Bel</p>
        </div>

        <p className="text-muted text-sm max-w-xs leading-relaxed">
          Tu espacio para planear, journalear y vivir más organizada.
          Descarga recursos gratuitos o explora mis productos digitales. 🌸
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
          <a href="#tienda" className="btn-primary text-center">
            Ver la tienda ✨
          </a>
          <a href="#gratis" className="btn-secondary text-center">
            Descargas gratis 🎁
          </a>
        </div>
      </div>
    </section>
  );
}
