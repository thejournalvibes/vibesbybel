import { FREE_DOWNLOADS } from "@/lib/products";
import { getAllFreeLinks } from "@/lib/redis";

const ICONS: Record<string, string> = {
  "calendarios": "🗓️",
  "cuaderno-digital": "📒",
  "fondos-de-pantalla": "🖼️",
  "hojitas-isadora": "🌸",
  "agenditas": "📔",
  "organizador-de-estudio": "📚",
  "organizador-trabajos-practicos": "📝",
  "pestanas-para-agendas": "🔖",
  "recursos-para-ipad": "📱",
  "portadas": "✨",
};

export default async function FreeDownloads() {
  const ids = FREE_DOWNLOADS.map((d) => d.id);
  const overrides = await getAllFreeLinks(ids);

  return (
    <section id="gratis" className="py-10 px-4 bg-cream relative overflow-hidden">
      <span className="absolute top-4 left-3 text-2xl rotate-12 opacity-50">🎁</span>
      <span className="absolute bottom-6 right-3 text-xl -rotate-6 opacity-40">📌</span>

      <div className="container mx-auto max-w-sm">
        <div className="text-center mb-8">
          <div className="paper-torn inline-block px-6 py-3 mb-2">
            <span className="text-xl mr-2">🎁</span>
            <h2 className="font-serif text-2xl font-bold text-charcoal inline">
              Archivos de regalo
            </h2>
          </div>
          <p className="text-sm text-muted">
            Descarga directo, sin registros ni correos. ¡Con amor! 💕
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FREE_DOWNLOADS.map((item, i) => {
            const rotations = ["rotate-1", "-rotate-1"];
            const colors = ["bg-blush/10", "bg-sky/10"];
            // Use Redis override if available, otherwise fall back to hardcoded
            const href = overrides[item.id] ?? item.downloadFile;

            return (
              <a
                key={item.id}
                href={href}
                download
                className={`
                  paper-card ${rotations[i % 2]} ${colors[i % 2]}
                  flex items-center gap-4 p-4
                  transition-transform hover:scale-[1.02] active:scale-[0.98]
                  cursor-pointer group
                `}
              >
                <div className="w-14 h-14 rounded-xl bg-white shadow-inner flex items-center justify-center text-3xl flex-shrink-0">
                  {ICONS[item.id] ?? "📄"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-serif font-bold text-charcoal text-sm leading-tight mb-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blush/20 group-hover:bg-blush/40 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 text-blush" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted mt-6 px-4">
          ¿Te gustaron los recursos gratis? Comparte con una amiga que también
          le guste planificar 💌
        </p>
      </div>
    </section>
  );
}
