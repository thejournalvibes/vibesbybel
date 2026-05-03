export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  downloadFile: string;
  category: "digital" | "free";
  tag?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "plantilla-finanzas-azul",
    name: "Planner Financiero Azul",
    description:
      "Tomá el control de tus finanzas con estilo. Registrá ingresos, gastos y metas de ahorro. PDF listo para imprimir.",
    price: 7500,
    originalPrice: 15000,
    currency: "ARS",
    images: [
      "/downloads/plantilla-finanzas-azul/carrusel/1.png",
      "/downloads/plantilla-finanzas-azul/carrusel/2.png",
      "/downloads/plantilla-finanzas-azul/carrusel/3.png",
      "/downloads/plantilla-finanzas-azul/carrusel/4.png",
    ],
    downloadFile: "https://drive.google.com/file/d/1fpNr6n_sfFe48WC5MOLt4Ll2lo6lvF4J/view?usp=sharing",
    category: "digital",
    tag: "💙 Nuevo",
  },
  {
    id: "plantilla-finanzas-rosa",
    name: "Planner Financiero Rosa",
    description:
      "Igual de completo, en versión rosada. Llevá tus finanzas al día con una plantilla que te va a encantar usar.",
    price: 7500,
    originalPrice: 15000,
    currency: "ARS",
    images: [
      "/downloads/plantilla-finanzas-rosa/carrusel/1.png",
      "/downloads/plantilla-finanzas-rosa/carrusel/2.png",
      "/downloads/plantilla-finanzas-rosa/carrusel/3.png",
      "/downloads/plantilla-finanzas-rosa/carrusel/4.png",
    ],
    downloadFile: "https://drive.google.com/file/d/1XO_U1ic8S8aSOvs9qlHr_zAjh0R3PUXE/view?usp=sharing",
    category: "digital",
    tag: "🩷 Nuevo",
  },
];

export const FREE_DOWNLOADS = [
  {
    id: "calendarios",
    name: "Calendarios",
    description: "Calendarios digitales para organizar tu mes con estilo.",
    price: 0,
    currency: "ARS",
    images: [],
    downloadFile: "https://drive.google.com/uc?export=download&id=1A0KaUlinKBW8pEXYuFSI6u7OsNnkns0L",
    category: "free" as const,
  },
  {
    id: "cuaderno-digital",
    name: "Cuaderno Digital",
    description: "Cuaderno digital listo para usar en tu tablet o app favorita.",
    price: 0,
    currency: "ARS",
    images: [],
    downloadFile: "https://drive.google.com/uc?export=download&id=1Ly-jYSvSBxnE6cltM9oYAW8yMNChLEXU",
    category: "free" as const,
  },
  {
    id: "fondos-de-pantalla",
    name: "Fondos de Pantalla",
    description: "Pack de wallpapers aesthetic para tu celu y computadora.",
    price: 0,
    currency: "ARS",
    images: [],
    downloadFile: "https://drive.google.com/uc?export=download&id=13RhFCD-JG0baQfxT8Xd7yh292tWcxe4s",
    category: "free" as const,
  },
  {
    id: "hojitas-isadora",
    name: "Agenditas",
    description: "Hojas decorativas para imprimir o usar en digital.",
    price: 0,
    currency: "ARS",
    images: [],
    downloadFile: "https://drive.google.com/uc?export=download&id=1ryO7hg75Kpn6C20eBBORdpLmc8ewU6Di",
    category: "free" as const,
  },
  {
    id: "organizador-de-estudio",
    name: "Organizador de Estudio",
    description: "Plantillas para organizar materias, tareas y horarios.",
    price: 0,
    currency: "ARS",
    images: [],
    downloadFile: "https://drive.google.com/uc?export=download&id=1ZR-bnxQnnBTTllH7IY_9tNkK_hiVe7C6",
    category: "free" as const,
  },
  {
    id: "organizador-trabajos-practicos",
    name: "Organizador de Trabajos Prácticos",
    description: "Estructura y entrega tus TPs sin estrés.",
    price: 0,
    currency: "ARS",
    images: [],
    downloadFile: "https://drive.google.com/uc?export=download&id=1mZTfrq9WMUfM36_mR_jN0h2mFv7wrmXm",
    category: "free" as const,
  },
  {
    id: "pestanas-para-agendas",
    name: "Recursos para iPad",
    description: "Pestañas imprimibles para indexar tu agenda o planner.",
    price: 0,
    currency: "ARS",
    images: [],
    downloadFile: "https://drive.google.com/uc?export=download&id=1Gd-_mBrN0AZ6zHk5r8IWY9tyiLB4n7_j",
    category: "free" as const,
  },
  {
    id: "portadas",
    name: "Portadas",
    description: "Portadas aesthetic para tus cuadernos, carpetas o digital.",
    price: 0,
    currency: "ARS",
    images: [],
    downloadFile: "https://drive.google.com/uc?export=download&id=192ka-B0EMlDQ4x1JupVtCR46LixY9fAg",
    category: "free" as const,
  },
];

export function getProductById(id: string): Product | undefined {
  return [...PRODUCTS, ...FREE_DOWNLOADS].find((p) => p.id === id) as Product | undefined;
}
