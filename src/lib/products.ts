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
    price: 10,
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
    currency: "MXN",
    image: "",
    downloadFile: "/downloads/free/Calendarios.zip",
    category: "free",
  },
  {
    id: "cuaderno-digital",
    name: "Cuaderno Digital",
    description: "Cuaderno digital listo para usar en tu tablet o app favorita.",
    price: 0,
    currency: "MXN",
    image: "",
    downloadFile: "/downloads/free/Cuaderno digital.zip",
    category: "free",
  },
  {
    id: "fondos-de-pantalla",
    name: "Fondos de Pantalla",
    description: "Pack de wallpapers aesthetic para tu celu y computadora.",
    price: 0,
    currency: "MXN",
    image: "",
    downloadFile: "/downloads/free/Fondos de pantalla.zip",
    category: "free",
  },
  {
    id: "hojitas-isadora",
    name: "Hojitas Isadora",
    description: "Hojas decorativas para imprimir o usar en digital.",
    price: 0,
    currency: "MXN",
    image: "",
    downloadFile: "/downloads/free/Hojitas Isadora.zip",
    category: "free",
  },
  {
    id: "organizador-de-estudio",
    name: "Organizador de Estudio",
    description: "Plantillas para organizar materias, tareas y horarios.",
    price: 0,
    currency: "MXN",
    image: "",
    downloadFile: "/downloads/free/Organizador de estudio.zip",
    category: "free",
  },
  {
    id: "organizador-trabajos-practicos",
    name: "Organizador de Trabajos Prácticos",
    description: "Estructura y entrega tus TPs sin estrés.",
    price: 0,
    currency: "MXN",
    image: "",
    downloadFile: "/downloads/free/Organizador de trabajos prácticos.zip",
    category: "free",
  },
  {
    id: "pestanas-para-agendas",
    name: "Pestañas para Agendas",
    description: "Pestañas imprimibles para indexar tu agenda o planner.",
    price: 0,
    currency: "MXN",
    image: "",
    downloadFile: "/downloads/free/Pestañas para agendas.zip",
    category: "free",
  },
  {
    id: "portadas",
    name: "Portadas",
    description: "Portadas aesthetic para tus cuadernos, carpetas o digital.",
    price: 0,
    currency: "MXN",
    image: "",
    downloadFile: "/downloads/free/Portadas.zip",
    category: "free",
  },
];

export function getProductById(id: string): Product | undefined {
  return [...PRODUCTS, ...FREE_DOWNLOADS].find((p) => p.id === id);
}
