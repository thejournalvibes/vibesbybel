const SOCIAL_LINKS = [
  {
    label: "TikTok",
    handle: "@thejournalvibes",
    href: "https://tiktok.com/@thejournalvibes",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.19 8.19 0 004.79 1.52V6.88a4.85 4.85 0 01-1.02-.19z" />
      </svg>
    ),
    color: "bg-charcoal text-cream",
    sticker: "🎬",
    rotate: "-rotate-1",
  },
  {
    label: "Instagram",
    handle: "@thejournalvibes_",
    href: "https://instagram.com/thejournalvibes_",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    color: "bg-blush text-white",
    sticker: "📸",
    rotate: "rotate-1",
  },
];

export default function SocialLinks() {
  return (
    <section className="py-8 px-4 bg-grid-pink">
      <div className="container mx-auto max-w-sm">
        <div className="text-center mb-6">
          <span className="sticker inline-block text-2xl rotate-6 mb-1">🔗</span>
          <h2 className="font-serif text-2xl font-bold text-charcoal">
            Encuéntrame aquí
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                link-card flex items-center gap-4 p-4 rounded-2xl shadow-paper
                ${link.color} ${link.rotate}
                transition-transform hover:scale-105 active:scale-95
              `}
            >
              <span className="text-2xl">{link.sticker}</span>
              <div className="flex-1">
                <p className="font-serif font-bold text-base leading-tight">{link.label}</p>
                <p className="text-sm opacity-80 font-mono">{link.handle}</p>
              </div>
              {link.icon}
            </a>
          ))}

          {/* Donar cafecito */}
          <a
            href="https://cafecito.app/thejournalvibes"
            target="_blank"
            rel="noopener noreferrer"
            className="
              link-card flex items-center gap-4 p-4 rounded-2xl shadow-paper
              bg-amber-100 text-charcoal rotate-0.5
              transition-transform hover:scale-105 active:scale-95
              border-2 border-dashed border-amber-300
            "
          >
            <span className="text-3xl">☕</span>
            <div className="flex-1">
              <p className="font-serif font-bold text-base">Donar un cafecito</p>
              <p className="text-sm opacity-70">Si te ayudó mi contenido 🥹</p>
            </div>
            <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
