export default function Footer() {
  return (
    <footer className="py-8 px-4 bg-charcoal text-cream">
      <div className="container mx-auto max-w-sm text-center">
        {/* Logo text */}
        <p className="font-script text-2xl text-blush mb-1">The Journal Vibes</p>
        <p className="font-script text-lg text-cream/70 mb-4">by Bel</p>

        {/* Links */}
        <div className="flex justify-center gap-6 text-sm text-cream/60 mb-4">
          <a href="#tienda" className="hover:text-blush transition-colors">
            Tienda
          </a>
          <a href="#gratis" className="hover:text-blush transition-colors">
            Gratis
          </a>
          <a href="#sobre-mi" className="hover:text-blush transition-colors">
            Sobre mí
          </a>
        </div>

        {/* Donate */}
        <a
          href="https://cafecito.app/vibesbybel"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-amber-100 text-charcoal text-sm font-bold px-4 py-2 rounded-full mb-6 hover:bg-amber-200 transition-colors"
        >
          ☕ Donar un cafecito
        </a>

        {/* Social */}
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="https://tiktok.com/@vibesbybel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/50 hover:text-blush transition-colors text-sm"
          >
            TikTok
          </a>
          <span className="text-cream/30">·</span>
          <a
            href="https://instagram.com/vibesbybel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/50 hover:text-blush transition-colors text-sm"
          >
            Instagram
          </a>
        </div>

        <p className="text-xs text-cream/30">
          © {new Date().getFullYear()} The Journal Vibes by Bel · Hecho con 💕
        </p>
        <p className="text-xs text-cream/20 mt-1">
          Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
