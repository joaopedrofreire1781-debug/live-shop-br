import pPhone from "@/assets/p-phone.jpg";
import pConsole from "@/assets/p-console.jpg";
import pSneaker from "@/assets/p-sneaker.jpg";
import pCards from "@/assets/p-cards.jpg";
import pHeadphones from "@/assets/p-headphones.jpg";
import pWatch from "@/assets/p-watch.jpg";
import prodTeclado from "@/assets/prod-teclado.jpg";
import prodJaqueta from "@/assets/prod-jaqueta.jpg";
import type { Category } from "./data";

export type Auction = {
  id: string;
  store_id: string;
  product_id?: string;
  title: string;
  description: string;
  category: Category;
  image: string;
  start_price: number;
  current_bid: number;
  increment: number;
  bids: number;
  /** segundos restantes no momento em que a página carrega (simulação) */
  ends_in: number;
  status: "live" | "soon";
  leader: string;
};

export const auctions: Auction[] = [
  {
    id: "a-1",
    store_id: "s-5",
    product_id: "pr-9",
    title: "iPhone 15 128GB seminovo",
    description: "Bateria 94%, sem marcas de uso, acompanha cabo e caixa original.",
    category: "Eletrônicos",
    image: pPhone,
    start_price: 2200,
    current_bid: 2850,
    increment: 50,
    bids: 17,
    ends_in: 102,
    status: "live",
    leader: "@carlos",
  },
  {
    id: "a-2",
    store_id: "s-6",
    product_id: "pr-10",
    title: "Console de nova geração 1TB",
    description: "Lacrado, nota fiscal e 1 ano de garantia do fabricante.",
    category: "Games",
    image: pConsole,
    start_price: 1500,
    current_bid: 2140,
    increment: 50,
    bids: 24,
    ends_in: 268,
    status: "live",
    leader: "@rafa_oli",
  },
  {
    id: "a-3",
    store_id: "s-7",
    product_id: "pr-11",
    title: "Tênis edição limitada — 42BR",
    description: "Par novo na caixa, etiqueta original, autenticado pela loja.",
    category: "Moda",
    image: pSneaker,
    start_price: 480,
    current_bid: 725,
    increment: 25,
    bids: 11,
    ends_in: 47,
    status: "live",
    leader: "@ana",
  },
  {
    id: "a-4",
    store_id: "s-8",
    product_id: "pr-12",
    title: "Lote com 3 cards graduados",
    description: "Três slabs 9.0+ em cápsula rígida. Envio com seguro.",
    category: "Colecionáveis",
    image: pCards,
    start_price: 900,
    current_bid: 1310,
    increment: 40,
    bids: 19,
    ends_in: 415,
    status: "live",
    leader: "@lucas",
  },
  {
    id: "a-5",
    store_id: "s-9",
    product_id: "pr-13",
    title: "Fone over-ear ANC premium",
    description: "Aberto para teste em live, sem uso. Estojo rígido incluso.",
    category: "Eletrônicos",
    image: pHeadphones,
    start_price: 320,
    current_bid: 468,
    increment: 20,
    bids: 8,
    ends_in: 190,
    status: "live",
    leader: "@bia.mtos",
  },
  {
    id: "a-6",
    store_id: "s-9",
    product_id: "pr-14",
    title: "Relógio smart aço inox",
    description: "Pulseira de aço, 2 pulseiras extras, garantia de 6 meses.",
    category: "Acessórios",
    image: pWatch,
    start_price: 600,
    current_bid: 830,
    increment: 30,
    bids: 13,
    ends_in: 620,
    status: "live",
    leader: "@vitor.hg",
  },
  {
    id: "a-7",
    store_id: "s-2",
    product_id: "pr-4",
    title: "Teclado mecânico hot-swap",
    description: "Switches lineares lubrificados, keycaps PBT.",
    category: "Games",
    image: prodTeclado,
    start_price: 250,
    current_bid: 250,
    increment: 20,
    bids: 0,
    ends_in: 900,
    status: "soon",
    leader: "—",
  },
  {
    id: "a-8",
    store_id: "s-1",
    product_id: "pr-1",
    title: "Jaqueta jeans peça única",
    description: "Modelagem oversized, numerada, feita em oficina parceira.",
    category: "Moda",
    image: prodJaqueta,
    start_price: 90,
    current_bid: 90,
    increment: 10,
    bids: 0,
    ends_in: 1500,
    status: "soon",
    leader: "—",
  },
];

export const getAuction = (id: string) => auctions.find((a) => a.id === id);

export const seedBids = (a: Auction) => {
  if (a.bids === 0) return [];
  const names = ["@carlos", "@lucas", "@ana", "@juliana_r", "@pedrinho"];
  return Array.from({ length: Math.min(5, a.bids) }, (_, i) => ({
    id: `${a.id}-seed-${i}`,
    user: i === 0 ? a.leader : names[(i + 1) % names.length]!,
    amount: a.current_bid - i * a.increment,
    ago: [2, 5, 9, 16, 28][i] ?? 30,
  }));
};

export const formatClock = (s: number) => {
  const safe = Math.max(0, Math.floor(s));
  const m = Math.floor(safe / 60);
  const sec = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};
