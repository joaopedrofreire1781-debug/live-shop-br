import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Avatar, LiveCard, ProductCard } from "@/components/commerce";
import { compact } from "@/lib/format";
import { getStore, liveByStore, productsByStore, stores } from "@/lib/data";
import { toggleFollow, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vendedor/$storeId")({
  head: () => ({
    meta: [
      { title: "Perfil do vendedor — Vitrine" },
      { name: "description", content: "Produtos, avaliações e live atual do vendedor." },
      { property: "og:title", content: "Perfil do vendedor — Vitrine" },
      { property: "og:description", content: "Siga a loja e compre direto das lives." },
    ],
  }),
  component: SellerProfile,
  notFoundComponent: () => (
    <AppShell nav={false}>
      <div className="p-8 text-center text-sm text-muted-foreground">Vendedor não encontrado.</div>
    </AppShell>
  ),
});

function SellerProfile() {
  const { storeId } = Route.useParams();
  if (!stores.some((s) => s.id === storeId)) throw notFound();
  const store = getStore(storeId);
  const navigate = useNavigate();
  const { following } = useAppState();
  const isFollowing = following.includes(store.id);
  const live = liveByStore(store.id);
  const items = productsByStore(store.id);

  return (
    <AppShell>
      <div className="relative h-28 brand-gradient">
        <button
          onClick={() => navigate({ to: "/explorar" })}
          className="absolute left-3 top-3 rounded-full bg-background/40 p-2 backdrop-blur"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="-mt-8 space-y-3 px-4">
        <Avatar initials={store.avatar} size="lg" className="ring-4 ring-background" />
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h1 className="flex items-center gap-1 truncate text-lg font-black">
              {store.name}
              {store.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />}
            </h1>
            <p className="text-xs text-muted-foreground">
              {store.handle} · {store.city}
            </p>
          </div>
          <button
            onClick={() => toggleFollow(store.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-bold",
              isFollowing ? "bg-surface-2" : "bg-primary text-primary-foreground",
            )}
          >
            {isFollowing ? "Seguindo" : "Seguir"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{store.bio}</p>
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface p-3 text-center">
          <Stat label="Seguidores" value={compact(store.followers)} />
          <Stat label="Avaliação" value={`${store.rating} ★`} />
          <Stat label="Avaliações" value={compact(store.reviews)} />
        </div>
      </div>

      {live && (
        <section className="mt-5 px-4">
          <h2 className="mb-2 text-sm font-bold">Ao vivo agora</h2>
          <LiveCard live={live} wide />
        </section>
      )}

      <section className="mt-5 px-4">
        <h2 className="mb-2 text-sm font-bold">Produtos</h2>
        <div className="grid grid-cols-2 gap-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-5 space-y-2 px-4 pb-8">
        <h2 className="text-sm font-bold">Avaliações</h2>
        {[
          { n: "Fernanda L.", t: "Atendimento excelente durante a live, tirou todas as dúvidas." },
          { n: "Marcos A.", t: "Embalagem caprichada e envio no mesmo dia." },
        ].map((r) => (
          <div key={r.n} className="rounded-2xl bg-surface p-3">
            <p className="flex items-center gap-1 text-xs font-semibold">
              {r.n} <Star className="h-3 w-3 fill-warning text-warning" />
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{r.t}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
