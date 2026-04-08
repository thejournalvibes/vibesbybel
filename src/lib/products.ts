export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  downloadFile: string;
  category: "digital" | "free";
  tag?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "planner-financiero",
    name: "Planner Financiero",
    description:
      "Toma el control de tus finanzas con estilo. Registra ingresos, gastos, metas de ahorro y más.",
    price: 1,
    currency: "ARS",
    image: "/images/plannerfinanciero.png",
    downloadFile: "/downloads/plannerfinanciero.xlsx",
    category: "digital",
    tag: "💖 Nuevo",
  },
];

export const FREE_DOWNLOADS: Product[] = [
  {
    id: "calendarios",
    name: "Calendarios",
    description: "Calendarios digitales para organizar tu mes con estilo.",
    price: 0,
    currency: "ARS",
    image: "",
    downloadFile: "https://drive.google.com/uc?export=download&id=1A0KaUlinKBW8pEXYuFSI6u7OsNnkns0L",
    category: "free",
  },
  {
    id: "cuaderno-digital",
    name: "Cuaderno Digital",
    description: "Cuaderno digital listo para usar en tu tablet o app favorita.",
    price: 0,
    currency: "ARS",
    image: "",
    downloadFile: "https://drive.google.com/uc?export=download&id=1Ly-jYSvSBxnE6cltM9oYAW8yMNChLEXU",
    category: "free",
  },
  {
    id: "fondos-de-pantalla",
    name: "Fondos de Pantalla",
    description: "Pack de wallpapers aesthetic para tu celu y computadora.",
    price: 0,
    currency: "ARS",
    image: "",
    downloadFile: "https://drive.google.com/uc?export=download&id=13RhFCD-JG0baQfxT8Xd7yh292tWcxe4s",
    category: "free",
  },
  {
    id: "hojitas-isadora",
    name: "Hojitas Isadora",
    description: "Hojas decorativas para imprimir o usar en digital.",
    price: 0,
    currency: "ARS",
    image: "",
    downloadFile: "https://drive.google.com/uc?export=download&id=1ryO7hg75Kpn6C20eBBORdpLmc8ewU6Di",
    category: "free",
  },
  {
    id: "organizador-de-estudio",
    name: "Organizador de Estudio",
    description: "Plantillas para organizar materias, tareas y horarios.",
    price: 0,
    currency: "ARS",
    image: "",
    downloadFile: "https://drive.google.com/uc?export=download&id=1ZR-bnxQnnBTTllH7IY_9tNkK_hiVe7C6",
    category: "free",
  },
  {
    id: "organizador-trabajos-practicos",
    name: "Organizador de Trabajos Prácticos",
    description: "Estructura y entrega tus TPs sin estrés.",
    price: 0,
    currency: "ARS",
    image: "",
    downloadFile: "https://drive.google.com/uc?export=download&id=1mZTfrq9WMUfM36_mR_jN0h2mFv7wrmXm",
    category: "free",
  },
  {
    id: "pestanas-para-agendas",
    name: "Pestañas para Agendas",
    description: "Pestañas imprimibles para indexar tu agenda o planner.",
    price: 0,
    currency: "ARS",
    image: "",
    downloadFile: "https://drive.google.com/uc?export=download&id=1Gd-_mBrN0AZ6zHk5r8IWY9tyiLB4n7_j",
    category: "free",
  },
  {
    id: "portadas",
    name: "Portadas",
    description: "Portadas aesthetic para tus cuadernos, carpetas o digital.",
    price: 0,
    currency: "ARS",
    image: "",
    downloadFile: "https://drive.google.com/uc?export=download&id=192ka-B0EMlDQ4x1JupVtCR46LixY9fAg",
    category: "free",
  },
];

export function getProductById(id: string): Product | undefined {
  return [...PRODUCTS, ...FREE_DOWNLOADS].find((p) => p.id === id);
}
