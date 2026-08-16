import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eye, Heart, Send, Share2, ShoppingBag, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Avatar, LiveBadge } from "@/components/commerce";
import { brl, compact } from "@/lib/format";
import { chatNames, chatPool, chatSeed, getLive, getProduct, getStore } from "@/lib/data";
import { addToCart, toggleFollow, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/live/$liveId")({
  head: () => ({
    meta: [
      { title: "Live agora — Vitrine" },
      { name: "description", content: "Assista à live e compre o produto fixado em segundos." },
      { property: "og:title", content: "Live agora — Vitrine" },
      { property: "og:description", content: "Compra rápida direto da transmissão ao vivo." },
    ],
  }),
  component: LivePage,
  notFoundComponent: () => (
    <AppShell nav={false}>
      <div className="p-8 text-center text-sm text-muted-foreground">Live não encontrada.</div>
    </AppShell>
  ),
});

type ChatLine = { id: string; author: string; text: string };

function LivePage() {
  const { liveId } = Route.useParams();
  const live = getLive(liveId);
  if (!live) throw notFound();
  const store = getStore(live.store_id);
  const navigate = useNavigate();
  const { following } = useAppState();
  const isFollowing = following.includes(store.id);

  const [pinnedId, setPinnedId] = useState(live.pinned_product_id);
  const pinned = getProduct(pinnedId)!;
  const [likes, setLikes] = useState(live.likes);
  const [viewers, setViewers] = useState(live.viewers);
  const [showProducts, setShowProducts] = useState(false);
  const [draft, setDraft] = useState("");
  const [chat, setChat] = useState<ChatLine[]>(
    (chatSeed['default'] ?? []).map((m) => ({ id: m.id, author: m.author, text: m.text })),
  );
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setChat((prev) =>
        [
          ...prev,
          {
            id: `m-${Date.now()}`,
            author: chatNames[Math.floor(Math.random() * chatNames.length)] ?? "convidado",
            text: chatPool[Math.floor(Math.random() * chatPool.length)] ?? "top!",
          },
        ].slice(-30),
      );
      setViewers((v) => Math.max(50, v + Math.floor(Math.random() * 21) - 8));
      setLikes((l) => l + Math.floor(Math.random() * 15));
    }, 2600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const buyNow = () => {
    addToCart(pinned.id, 1, pinned.variants.options[0]);
    navigate({ to: "/checkout" });
  };

  const send = () => {
    if (!draft.trim()) return;
    setChat((p) => [...p, { id: `me-${Date.now()}`, author: "você", text: draft.trim() }]);
    setDraft("");
  };

  return (
    <AppShell nav={false} className="relative">
      <div className="relative min-h-screen">
        <img
          src={live.thumbnail}
          alt={live.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background" />

        <div className="relative flex min-h-screen flex-col">
          {/* Top bar */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-3">
            <div className="flex min-w-0 items-center gap-2">
              <button
                onClick={() => navigate({ to: "/" })}
                className="rounded-full bg-background/60 p-2 backdrop-blur"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex min-w-0 items-center gap-2 rounded-full bg-background/60 p-1 pr-3 backdrop-blur">
                <Avatar initials={store.avatar} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{store.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {compact(store.followers)} seguidores
                  </p>
                </div>
                <button
                  onClick={() => toggleFollow(store.id)}
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
                    isFollowing
                      ? "bg-surface-2 text-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {isFollowing ? "Seguindo" : "Seguir"}
                </button>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <LiveBadge />
              <span className="inline-flex items-center gap-1 rounded-md bg-background/60 px-1.5 py-1 text-[10px] font-semibold backdrop-blur">
                <Eye className="h-3 w-3" /> {compact(viewers)}
              </span>
            </div>
          </div>

          <p className="px-4 text-xs font-medium text-muted-foreground">{live.title}</p>

          <div className="flex-1" />

          {/* Chat + side actions */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 px-3">
            <div className="no-scrollbar max-h-52 space-y-1.5 overflow-y-auto pb-2">
              {chat.map((m) => (
                <p key={m.id} className="animate-rise text-xs">
                  <span className="rounded-full bg-background/50 px-2 py-1 backdrop-blur">
                    <span className="font-semibold text-accent">{m.author}</span>{" "}
                    <span className="text-foreground/90">{m.text}</span>
                  </span>
                </p>
              ))}
              <div ref={chatEnd} />
            </div>
            <div className="flex shrink-0 flex-col items-center gap-3 pb-2">
              <button
                onClick={() => setLikes((l) => l + 1)}
                className="grid place-items-center gap-0.5 text-[10px] font-semibold"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-background/60 backdrop-blur">
                  <Heart className="h-5 w-5 text-primary" />
                </span>
                {compact(likes)}
              </button>
              <button className="grid place-items-center gap-0.5 text-[10px] font-semibold">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-background/60 backdrop-blur">
                  <Share2 className="h-5 w-5" />
                </span>
                Enviar
              </button>
              <button
                onClick={() => setShowProducts(true)}
                className="grid place-items-center gap-0.5 text-[10px] font-semibold"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-background/60 backdrop-blur">
                  <ShoppingBag className="h-5 w-5" />
                </span>
                {live.product_ids.length} itens
              </button>
            </div>
          </div>

          {/* Chat input */}
          <div className="flex items-center gap-2 px-3 pb-2 pt-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Mandar mensagem…"
              className="flex-1 rounded-full bg-background/70 px-4 py-2.5 text-xs outline-none backdrop-blur placeholder:text-muted-foreground"
            />
            <button
              onClick={send}
              className="rounded-full bg-primary p-2.5 text-primary-foreground"
              aria-label="Enviar mensagem"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {/* Pinned product */}
          <div className="border-t border-border bg-background/95 p-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <img
                src={pinned.images[0]}
                alt={pinned.name}
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <Link
                  to="/produto/$productId"
                  params={{ productId: pinned.id }}
                  className="line-clamp-1 text-xs font-semibold"
                >
                  {pinned.name}
                </Link>
                <p className="text-lg font-black text-primary">{brl(pinned.price)}</p>
                <p className="text-[10px] text-muted-foreground">
                  {pinned.sold} vendidos · {pinned.stock} em estoque
                </p>
              </div>
            </div>
            <button
              onClick={buyNow}
              className="mt-3 w-full rounded-full brand-gradient py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground glow"
            >
              Comprar agora
            </button>
          </div>
        </div>

        {/* Products sheet */}
        {showProducts && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end bg-background/70 backdrop-blur-sm">
            <div className="animate-rise max-h-[70vh] overflow-y-auto rounded-t-3xl bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold">Produtos desta live</h2>
                <button onClick={() => setShowProducts(false)} aria-label="Fechar">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {live.product_ids.map((id) => {
                  const p = getProduct(id)!;
                  return (
                    <div key={id} className="flex items-center gap-3 rounded-2xl bg-surface-2 p-2.5">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-xs font-medium">{p.name}</p>
                        <p className="text-sm font-bold text-primary">{brl(p.price)}</p>
                      </div>
                      <button
                        onClick={() => {
                          setPinnedId(p.id);
                          setShowProducts(false);
                        }}
                        className="shrink-0 rounded-full bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground"
                      >
                        Fixar
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
