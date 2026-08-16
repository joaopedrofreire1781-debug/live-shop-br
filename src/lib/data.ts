import liveModa from "@/assets/live-moda.jpg";
import liveTech from "@/assets/live-tech.jpg";
import liveBeleza from "@/assets/live-beleza.jpg";
import liveColec from "@/assets/live-colecionaveis.jpg";
import prodJaqueta from "@/assets/prod-jaqueta.jpg";
import prodFone from "@/assets/prod-fone.jpg";
import prodSkincare from "@/assets/prod-skincare.jpg";
import prodTeclado from "@/assets/prod-teclado.jpg";

/**
 * Mock dataset shaped exactly like the intended tables:
 * profiles, stores, products, lives, live_products, orders, order_items,
 * followers, messages.
 */

export type Category =
  | "Moda"
  | "Tecnologia"
  | "Beleza"
  | "Casa"
  | "Games"
  | "Colecionáveis"
  | "Esportes"
  | "Acessórios"
  | "Eletrônicos"
  | "Outros";

export const CATEGORIES: Category[] = [
  "Moda",
  "Tecnologia",
  "Beleza",
  "Casa",
  "Games",
  "Colecionáveis",
  "Esportes",
  "Acessórios",
  "Eletrônicos",
  "Outros",
];

export type Profile = {
  id: string;
  handle: string;
  name: string;
  avatar: string;
};

export type Store = {
  id: string;
  profile_id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  rating: number;
  reviews: number;
  followers: number;
  verified: boolean;
  city: string;
};

export type Product = {
  id: string;
  store_id: string;
  name: string;
  price: number;
  old_price?: number;
  images: string[];
  category: Category;
  stock: number;
  sold: number;
  rating: number;
  reviews: number;
  description: string;
  variants: { label: string; options: string[] };
};

export type Live = {
  id: string;
  store_id: string;
  title: string;
  category: Category;
  thumbnail: string;
  viewers: number;
  likes: number;
  is_live: boolean;
  starts_in?: string;
  product_ids: string[];
  pinned_product_id: string;
};

export type Message = { id: string; live_id: string; author: string; text: string };

export type OrderStatus = "Pagamento aprovado" | "Preparando pedido" | "Enviado" | "Entregue";

export type OrderItem = {
  product_id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  profile_id: string;
  code: string;
  created_at: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping: number;
  total: number;
  store_name: string;
};

export const currentProfile: Profile = {
  id: "p-me",
  handle: "@joaopedro",
  name: "João Pedro",
  avatar: "JP",
};

export const stores: Store[] = [
  {
    id: "s-1",
    profile_id: "p-1",
    name: "Ateliê Marina",
    handle: "@ateliemarina",
    avatar: "AM",
    bio: "Moda autoral feita no Brasil. Peças limitadas toda semana em live.",
    rating: 4.9,
    reviews: 1284,
    followers: 48200,
    verified: true,
    city: "São Paulo, SP",
  },
  {
    id: "s-2",
    profile_id: "p-2",
    name: "TechDrop",
    handle: "@techdrop",
    avatar: "TD",
    bio: "Gadgets testados ao vivo. Se não prestar, a gente fala.",
    rating: 4.7,
    reviews: 3110,
    followers: 92400,
    verified: true,
    city: "Curitiba, PR",
  },
  {
    id: "s-3",
    profile_id: "p-3",
    name: "Glow Lab",
    handle: "@glowlab",
    avatar: "GL",
    bio: "Skincare e maquiagem com curadoria de dermato.",
    rating: 4.8,
    reviews: 876,
    followers: 31500,
    verified: false,
    city: "Recife, PE",
  },
  {
    id: "s-4",
    profile_id: "p-4",
    name: "Raridades do Zé",
    handle: "@raridadesdoze",
    avatar: "RZ",
    bio: "Cards, action figures e relíquias garimpadas.",
    rating: 4.6,
    reviews: 512,
    followers: 18900,
    verified: false,
    city: "Belo Horizonte, MG",
  },
];

export const products: Product[] = [
  {
    id: "pr-1",
    store_id: "s-1",
    name: "Jaqueta jeans oversized lavagem clara",
    price: 149.9,
    old_price: 229.9,
    images: [prodJaqueta, liveModa],
    category: "Moda",
    stock: 7,
    sold: 312,
    rating: 4.8,
    reviews: 214,
    description:
      "Jeans encorpado com caimento oversized, bolsos frontais e acabamento reforçado. Modelagem unissex, feita em oficina parceira em São Paulo.",
    variants: { label: "Tamanho", options: ["P", "M", "G", "GG"] },
  },
  {
    id: "pr-2",
    store_id: "s-1",
    name: "Camiseta pesada algodão pima",
    price: 89.9,
    old_price: 119.9,
    images: [liveModa],
    category: "Moda",
    stock: 22,
    sold: 1043,
    rating: 4.7,
    reviews: 388,
    description: "Malha 240g, gola reforçada, não deforma na lavagem. Cores neutras.",
    variants: { label: "Tamanho", options: ["P", "M", "G", "GG"] },
  },
  {
    id: "pr-3",
    store_id: "s-2",
    name: "Fone bluetooth com cancelamento de ruído",
    price: 379.0,
    old_price: 529.0,
    images: [prodFone, liveTech],
    category: "Eletrônicos",
    stock: 14,
    sold: 867,
    rating: 4.6,
    reviews: 502,
    description:
      "Até 38h de bateria, ANC híbrido, modo transparência e conexão multiponto. Estojo rígido incluso.",
    variants: { label: "Cor", options: ["Preto", "Areia", "Grafite"] },
  },
  {
    id: "pr-4",
    store_id: "s-2",
    name: "Teclado mecânico RGB hot-swap",
    price: 459.0,
    images: [prodTeclado],
    category: "Games",
    stock: 9,
    sold: 240,
    rating: 4.9,
    reviews: 131,
    description: "Switches lineares, estabilizadores lubrificados e software de macros em PT-BR.",
    variants: { label: "Switch", options: ["Linear", "Tátil", "Clicky"] },
  },
  {
    id: "pr-5",
    store_id: "s-3",
    name: "Kit skincare noturno 3 passos",
    price: 199.9,
    old_price: 289.9,
    images: [prodSkincare, liveBeleza],
    category: "Beleza",
    stock: 31,
    sold: 1520,
    rating: 4.9,
    reviews: 640,
    description: "Sérum de niacinamida, hidratante ceramidas e óleo facial. Dermatologicamente testado.",
    variants: { label: "Pele", options: ["Oleosa", "Mista", "Seca"] },
  },
  {
    id: "pr-6",
    store_id: "s-3",
    name: "Blush cremoso pigmento alto",
    price: 69.9,
    images: [liveBeleza],
    category: "Beleza",
    stock: 48,
    sold: 2140,
    rating: 4.8,
    reviews: 910,
    description: "Textura sedosa, acabamento natural, vegano e cruelty free.",
    variants: { label: "Tom", options: ["Coral", "Rosé", "Terra"] },
  },
  {
    id: "pr-7",
    store_id: "s-4",
    name: "Card holográfico raro slab 9.5",
    price: 899.0,
    images: [liveColec],
    category: "Colecionáveis",
    stock: 1,
    sold: 12,
    rating: 5,
    reviews: 24,
    description: "Peça avaliada e encapsulada. Envio com seguro e embalagem rígida.",
    variants: { label: "Condição", options: ["Slab 9.5"] },
  },
  {
    id: "pr-8",
    store_id: "s-4",
    name: "Action figure articulado edição limitada",
    price: 329.0,
    old_price: 399.0,
    images: [liveColec],
    category: "Colecionáveis",
    stock: 4,
    sold: 58,
    rating: 4.7,
    reviews: 33,
    description: "28cm, 32 pontos de articulação, acompanha base e acessórios.",
    variants: { label: "Versão", options: ["Padrão", "Exclusiva"] },
  },
];

export const lives: Live[] = [
  {
    id: "lv-1",
    store_id: "s-1",
    title: "Drop de inverno — peças únicas a partir de R$ 89",
    category: "Moda",
    thumbnail: liveModa,
    viewers: 2841,
    likes: 12400,
    is_live: true,
    product_ids: ["pr-1", "pr-2"],
    pinned_product_id: "pr-1",
  },
  {
    id: "lv-2",
    store_id: "s-2",
    title: "Testando fones ANC ao vivo (com desconto relâmpago)",
    category: "Tecnologia",
    thumbnail: liveTech,
    viewers: 1734,
    likes: 8600,
    is_live: true,
    product_ids: ["pr-3", "pr-4"],
    pinned_product_id: "pr-3",
  },
  {
    id: "lv-3",
    store_id: "s-3",
    title: "Rotina de skincare + kit com 30% off",
    category: "Beleza",
    thumbnail: liveBeleza,
    viewers: 4520,
    likes: 20100,
    is_live: true,
    product_ids: ["pr-5", "pr-6"],
    pinned_product_id: "pr-5",
  },
  {
    id: "lv-4",
    store_id: "s-4",
    title: "Leilão de raridades: cards e figures",
    category: "Colecionáveis",
    thumbnail: liveColec,
    viewers: 986,
    likes: 3400,
    is_live: true,
    product_ids: ["pr-7", "pr-8"],
    pinned_product_id: "pr-7",
  },
];

export const chatSeed: Record<string, Message[]> = {
  default: [
    { id: "m1", live_id: "", author: "carol.s", text: "chegou agora, o que perdi? 😅" },
    { id: "m2", live_id: "", author: "rafa_oli", text: "esse preço tá bom demais" },
    { id: "m3", live_id: "", author: "bia.mtos", text: "tem tamanho G?" },
    { id: "m4", live_id: "", author: "lucas.pv", text: "comprei! primeira vez aqui" },
    { id: "m5", live_id: "", author: "ana.paula", text: "manda o link do fixado 🙏" },
  ],
};

export const chatPool = [
  "vendeu rápido demais 😱",
  "quanto fica o frete pro RS?",
  "acabei de comprar 2",
  "mostra de perto por favor",
  "esse é meu terceiro pedido com vocês",
  "tem parcelamento?",
  "melhor live da semana",
  "guarda um pra mim!",
  "chegou em 3 dias aqui em Fortaleza",
  "qual o tecido?",
];

export const chatNames = [
  "juliana_r",
  "pedrinho",
  "mari.costa",
  "vitor.hg",
  "tati_alves",
  "gabs",
  "renan.dev",
  "leticia.m",
];

export const orders: Order[] = [
  {
    id: "o-1",
    profile_id: "p-me",
    code: "VT-8241",
    created_at: "12 ago 2026",
    status: "Entregue",
    store_name: "Glow Lab",
    items: [{ product_id: "pr-5", name: products[4]!.name, image: prodSkincare, price: 199.9, qty: 1 }],
    shipping: 0,
    total: 199.9,
  },
  {
    id: "o-2",
    profile_id: "p-me",
    code: "VT-8312",
    created_at: "14 ago 2026",
    status: "Enviado",
    store_name: "TechDrop",
    items: [{ product_id: "pr-3", name: products[2]!.name, image: prodFone, price: 379, qty: 1 }],
    shipping: 19.9,
    total: 398.9,
  },
  {
    id: "o-3",
    profile_id: "p-me",
    code: "VT-8377",
    created_at: "15 ago 2026",
    status: "Preparando pedido",
    store_name: "Ateliê Marina",
    items: [{ product_id: "pr-1", name: products[0]!.name, image: prodJaqueta, price: 149.9, qty: 2 }],
    shipping: 24.9,
    total: 324.7,
  },
  {
    id: "o-4",
    profile_id: "p-me",
    code: "VT-8390",
    created_at: "16 ago 2026",
    status: "Pagamento aprovado",
    store_name: "Raridades do Zé",
    items: [{ product_id: "pr-8", name: products[7]!.name, image: liveColec, price: 329, qty: 1 }],
    shipping: 29.9,
    total: 358.9,
  },
];

export const followers = [
  { profile_id: "p-me", store_id: "s-3" },
  { profile_id: "p-me", store_id: "s-2" },
];

export const getStore = (id: string) => stores.find((s) => s.id === id)!;
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getLive = (id: string) => lives.find((l) => l.id === id);
export const productsByStore = (id: string) => products.filter((p) => p.store_id === id);
export const liveByStore = (id: string) => lives.find((l) => l.store_id === id && l.is_live);
