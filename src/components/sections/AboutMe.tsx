"use client";

import Image from "next/image";

export default function AboutMe() {
  return (
    <section id="sobre-mi" className="py-10 px-4 bg-grid-pink relative">
      <div className="container mx-auto max-w-sm">
        {/* Section header */}
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-charcoal">
            Sobre mí
          </h2>
          <div className="washi-tape washi-pink mx-auto mt-1 w-20 h-3 opacity-70" />
        </div>

        {/* Photo in polaroid */}
        <div className="polaroid -rotate-2 mx-auto max-w-[200px] mb-6">
          <div className="relative w-full aspect-square rounded-sm overflow-hidden" style={{ backgroundColor: "#EDB8BE" }}>
            <Image
              src="/images/bel.jpg"
              alt="Bel - Journal Vibes"
              fill
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg=="
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
          <p className="font-script text-sm text-center mt-2 text-charcoal">
            ¡Hola, soy Bel! 🌸
          </p>
        </div>

        {/* About text on paper */}
        <div className="paper-card relative p-6">
          <div className="washi-tape washi-pink absolute -top-2 left-6 w-16 h-4 opacity-80" />
          <div className="washi-tape washi-blue absolute -top-2 right-6 w-12 h-4 opacity-80" />

          <p className="text-charcoal text-sm leading-relaxed mb-4">
            ¡Hola! Soy <strong>Bel</strong>, creadora de contenido enfocada en
            planning, journaling y organización. 📓
          </p>
          <p className="text-charcoal text-sm leading-relaxed mb-4">
            Empecé a journalear hace algunos años como una forma de
            <em> ordenar mi mente</em> y desde entonces se convirtió en mi
            práctica favorita. Comparto tips, rutinas y recursos para que tú
            también puedas conectar contigo misma a través de la escritura. 🌙
          </p>
          <p className="text-charcoal text-sm leading-relaxed">
            Acá encontrarás todo lo que necesitas para empezar o profundizar tu
            práctica: desde plantillas gratuitas hasta kits completos de
            planificación. ✨
          </p>

          {/* Small sticker details */}
          <div className="flex gap-3 mt-5 flex-wrap">
            {["📝 Journaling", "🗓️ Planning", "🦋 Crecimiento", "☕ Cafecito"].map(
              (tag) => (
                <span
                  key={tag}
                  className="bg-blush/20 text-charcoal text-xs px-3 py-1 rounded-full border border-blush/40"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
