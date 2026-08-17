import { useSyncExternalStore } from "react";
import { getProduct, orders as seedOrders, type Order, type OrderStatus } from "./data";

export type CartLine = { productId: string; qty: number; variant?: string | undefined };

type State = { cart: CartLine[]; orders: Order[]; following: string[] };

let state: State = { cart: [], orders: seedOrders, following: ["s-3", "s-2"] };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

export const useAppState = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export function addToCart(productId: string, qty = 1, variant?: string) {
  const existing = state.cart.find((l) => l.productId === productId && l.variant === variant);
  const cart = existing
    ? state.cart.map((l) => (l === existing ? { ...l, qty: l.qty + qty } : l))
    : [...state.cart, { productId, qty, variant }];
  state = { ...state, cart };
  emit();
}

export function setQty(productId: string, variant: string | undefined, qty: number) {
  const cart =
    qty <= 0
      ? state.cart.filter((l) => !(l.productId === productId && l.variant === variant))
      : state.cart.map((l) =>
          l.productId === productId && l.variant === variant ? { ...l, qty } : l,
        );
  state = { ...state, cart };
  emit();
}

export function clearCart() {
  state = { ...state, cart: [] };
  emit();
}

export function toggleFollow(storeId: string) {
  const following = state.following.includes(storeId)
    ? state.following.filter((s) => s !== storeId)
    : [...state.following, storeId];
  state = { ...state, following };
  emit();
}

export const cartTotals = (cart: CartLine[]) => {
  const subtotal = cart.reduce((sum, l) => sum + (getProduct(l.productId)?.price ?? 0) * l.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal > 300 ? 0 : 19.9;
  return { subtotal, shipping, total: subtotal + shipping };
};

export function placeOrder(lines: CartLine[], storeName: string): Order {
  const { shipping, total } = cartTotals(lines);
  const order: Order = {
    id: `o-${Date.now()}`,
    profile_id: "p-me",
    code: `VT-${Math.floor(9000 + Math.random() * 999)}`,
    created_at: "hoje",
    status: "Pagamento aprovado" as OrderStatus,
    store_name: storeName,
    shipping,
    total,
    items: lines.map((l) => {
      const p = getProduct(l.productId)!;
      return { product_id: p.id, name: p.name, image: p.images[0] ?? "", price: p.price, qty: l.qty };
    }),
  };
  state = { ...state, orders: [order, ...state.orders], cart: [] };
  emit();
  return order;
}

export const getOrder = (id: string) => state.orders.find((o) => o.id === id);

/* ---------------------------------------------------------------------------
 * Leilões (simulação 100% frontend) e área do vendedor
 * ------------------------------------------------------------------------- */

export type Bid = { id: string; user: string; amount: number; at: number };

export type SellerProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: "Ativo" | "Rascunho";
  image?: string;
};

export type SellerAuction = {
  id: string;
  product: string;
  start_price: number;
  increment: number;
  minutes: number;
  description: string;
};

type ExtraState = {
  bids: Record<string, Bid[]>;
  sellerProducts: SellerProduct[];
  sellerAuctions: SellerAuction[];
};

let extra: ExtraState = {
  bids: {},
  sellerProducts: [
    { id: "sp-1", name: "iPhone 15 128GB", price: 3899, category: "Eletrônicos", stock: 6, status: "Ativo" },
    { id: "sp-2", name: "Fone over-ear ANC premium", price: 899, category: "Eletrônicos", stock: 18, status: "Ativo" },
    { id: "sp-3", name: "Relógio smart aço inox", price: 1249, category: "Acessórios", stock: 9, status: "Ativo" },
    { id: "sp-4", name: "Tênis branco couro premium", price: 749, category: "Moda", stock: 12, status: "Ativo" },
    { id: "sp-5", name: "Console nova geração 1TB", price: 3499, category: "Games", stock: 4, status: "Rascunho" },
  ],
  sellerAuctions: [],
};

const extraListeners = new Set<() => void>();
const emitExtra = () => extraListeners.forEach((l) => l());
const subscribeExtra = (l: () => void) => {
  extraListeners.add(l);
  return () => extraListeners.delete(l);
};
const getExtra = () => extra;

export const useSellerState = () => useSyncExternalStore(subscribeExtra, getExtra, getExtra);

export function placeBid(auctionId: string, amount: number, user = "@voce") {
  const list = extra.bids[auctionId] ?? [];
  const bid: Bid = { id: `${auctionId}-${Date.now()}`, user, amount, at: Date.now() };
  extra = { ...extra, bids: { ...extra.bids, [auctionId]: [bid, ...list] } };
  emitExtra();
  return bid;
}

export function addSellerProduct(p: Omit<SellerProduct, "id" | "status"> & { status?: SellerProduct["status"] }) {
  const item: SellerProduct = { id: `sp-${Date.now()}`, status: p.status ?? "Ativo", ...p };
  extra = { ...extra, sellerProducts: [item, ...extra.sellerProducts] };
  emitExtra();
  return item;
}

export function addSellerAuction(a: Omit<SellerAuction, "id">) {
  const item: SellerAuction = { id: `sa-${Date.now()}`, ...a };
  extra = { ...extra, sellerAuctions: [item, ...extra.sellerAuctions] };
  emitExtra();
  return item;
}
