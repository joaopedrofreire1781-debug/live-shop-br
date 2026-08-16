import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Share2, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Avatar } from "@/components/commerce";
import { brl, compact } from "@/lib/format";
import { getProduct, getStore } from "@/lib/data";
import { addToCart, toggleFollow, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produto/$productId")({
  head: () => ({
    meta: [
      { title: "Produto — Vitrine" },
      { name: "description", content: "Detalhes do produto, avaliações, estoque e compra rápida." },
      { property: "og:title", content: "Produto — Vitrine" },
      { property: "og:description", content: "Compre em poucos toques no marketplace Vitrine." },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <AppShell nav={false}>
      <div className="p-8 text-center text-sm text-muted-foreground">Produto não encontrado.</div>
    </AppShell>
  ),
});

function ProductPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  if (!product) throw notFound();
  const store = getStore(product.store_id);
  const navigate = useNavigate();
  const { following } = useAppState();
  const isFollowing = following.includes(store.id);
  const [img, setImg] = useState(0);
  const [variant, setVariant] = useState(product.variants.options[0]!);
  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : 0;

  return (
    <AppShell>
      <div className="relative">
        <img
          src={product.images[img]}
          alt={product.name}
          className="h-96 w-full object-cover"
          width={768}
          height={768}
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <button
            onClick={() => navigate({ to: "/" })}
            className="rounded-full bg-background/60 p-2 backdrop-blur"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button className="rounded-full bg-background/60 p-2 backdrop-blur" aria-label="Compartilhar">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        {product.images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImg(i)}
                aria-label={`Imagem ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === img ? "w-5 bg-primary" : "w-1.5 bg-foreground/40",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 p-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary">{brl(product.price)}</span>
            {product.old_price && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {brl(product.old_price)}
                </span>
                <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                  -{discount}%
                </span>
              </>
            )}
          </div>
          <h1 className="mt-1 text-base font-bold leading-snug">{product.name}</h1>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {product.rating} (
              {product.reviews})
            </span>
            · {compact(product.sold)} vendidos · {product.stock} em estoque
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold">{product.variants.label}</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.options.map((o) => (
              <button
                key={o}
                onClick={() => setVariant(o)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-xs font-medium",
                  variant === o ? "bg-primary text-primary-foreground" : "bg-surface",
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <Link
          to="/vendedor/$storeId"
          params={{ storeId: store.id }}
          className="flex items-center gap-3 rounded-2xl bg-surface p-3"
        >
          <Avatar initials={store.avatar} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-sm font-semibold">
              {store.name}
              {store.verified && <BadgeCheck className="h-3.5 w-3.5 text-accent" />}
            </p>
            <p className="text-[11px] text-muted-foreground">
              ⭐ {store.rating} · {compact(store.followers)} seguidores
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFollow(store.id);
            }}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold",
              isFollowing ? "bg-surface-2" : "bg-primary text-primary-foreground",
            )}
          >
            {isFollowing ? "Seguindo" : "Seguir"}
          </button>
        </Link>

        <div>
          <h2 className="mb-1 text-sm font-bold">Descrição</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">{product.description}</p>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-bold">Avaliações</h2>
          <div className="space-y-2">
            {[
              { n: "Camila R.", t: "Chegou rápido e igualzinho na live. Recomendo!" },
              { n: "Diego M.", t: "Qualidade ótima pelo preço, comprei outro." },
            ].map((r) => (
              <div key={r.n} className="rounded-2xl bg-surface p-3">
                <p className="text-xs font-semibold">
                  {r.n} <span className="text-warning">★★★★★</span>
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{r.t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-30 flex gap-2 border-t border-border bg-background/95 p-3 backdrop-blur">
        <button
          onClick={() => addToCart(product.id, 1, variant)}
          className="flex-1 rounded-full bg-surface-2 py-3.5 text-sm font-bold"
        >
          Adicionar ao carrinho
        </button>
        <button
          onClick={() => {
            addToCart(product.id, 1, variant);
            navigate({ to: "/checkout" });
          }}
          className="flex-1 rounded-full brand-gradient py-3.5 text-sm font-bold text-primary-foreground glow"
        >
          Comprar agora
        </button>
      </div>
    </AppShell>
  );
}
