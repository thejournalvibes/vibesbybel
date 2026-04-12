import Image from "next/image";

export default function NotionSection() {
  return (
    <section id="notion" className="py-10 px-4 bg-cream relative overflow-hidden">
      <span className="absolute top-6 right-4 text-3xl rotate-12 opacity-50">📓</span>
      <span className="absolute bottom-10 left-2 text-2xl -rotate-12 opacity-30">✦</span>

      <div className="container mx-auto max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="paper-torn inline-block px-6 py-3 mb-2">
            <span className="text-xl mr-2">📓</span>
            <h2 className="font-serif text-2xl font-bold text-charcoal inline">
              Notion
            </h2>
          </div>
          <p className="text-sm text-muted">
            Plantillas gratis para organizar tu vida con estilo 🌙
          </p>
          <div className="washi-tape washi-blue mx-auto mt-2 w-32 h-4 opacity-60" />
        </div>

        {/* Image in polaroid */}
        <div className="polaroid -rotate-1 mb-6">
          <div className="relative w-full aspect-[3/4]" style={{ backgroundColor: "#F5F0E8" }}>
            <Image
              src="/images/notion-mainscreen.png"
              alt="Plantillas de Notion — organizá tu vida"
              fill
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg=="
            />
          </div>
          <p className="text-center font-script text-charcoal text-sm pt-2 pb-1">
            Organizá tu vida con Notion ✦
          </p>
        </div>

        {/* How-to card */}
        <div className="paper-card p-5">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-3 w-10 rounded-sm washi-tape washi-pink opacity-70" />
            <h3 className="font-serif font-bold text-charcoal text-sm whitespace-nowrap">
              ¿Cómo obtenerlas? 🎁
            </h3>
            <div className="h-3 w-10 rounded-sm washi-tape washi-pink opacity-70" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="font-serif font-black text-blush text-sm leading-5 flex-shrink-0">01</span>
              <p className="text-sm text-charcoal leading-snug">
                Seguime en Instagram{" "}
                <span className="font-semibold text-blush">@thejournalvibes_</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-serif font-black text-blush text-sm leading-5 flex-shrink-0">02</span>
              <p className="text-sm text-charcoal leading-snug">
                Mandame un mensaje directo diciéndome qué plantilla querés
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-serif font-black text-blush text-sm leading-5 flex-shrink-0">03</span>
              <p className="text-sm text-charcoal leading-snug">
                ¡Listo! Te la comparto completamente gratis 🌸
              </p>
            </div>
          </div>

          <a
            href="https://instagram.com/thejournalvibes_"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-5 w-full"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Ir a Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
}
