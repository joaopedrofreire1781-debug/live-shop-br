import { Link } from "@tanstack/react-router";
import { Eye, Star, BadgeCheck } from "lucide-react";
import { brl, compact } from "@/lib/format";
import { getStore, type Live, type Product, type Store } from "@/lib/data";
import { cn } from "@/lib/utils";

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-live px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-live-foreground",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-live-foreground animate-live-dot" />
      Ao vivo
    </span>
  );
}

export function Avatar({
  initials,
  size = "md",
  className,
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full brand-gradient font-bold text-primary-foreground",
        size === "sm" && "h-7 w-7 text-[10px]",
        size === "md" && "h-9 w-9 text-xs",
        size === "lg" && "h-16 w-16 text-lg",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function LiveCard({ live, wide = false }: { live: Live; wide?: boolean }) {
  const store = getStore(live.store_id);
  return (
    <Link
      to="/live/$liveId"
      params={{ liveId: live.id }}
      className={cn(
        "group relative block shrink-0 overflow-hidden rounded-2xl bg-surface",
        wide ? "w-full" : "w-40",
      )}
    >
      <img
        src={live.thumbnail}
        alt={live.title}
        loading="lazy"
        className={cn(
          "w-full object-cover transition-transform duration-300 group-active:scale-105",
          wide ? "h-56" : "h-56",
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
      <div className="absolute left-2 top-2 flex items-center gap-1.5">
        <LiveBadge />
        <span className="inline-flex items-center gap-1 rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur">
          <Eye className="h-3 w-3" /> {compact(live.viewers)}
        </span>
      </div>
      <span className="absolute right-2 top-2 rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur">
        {live.category}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Avatar initials={store.avatar} size="sm" />
          <span className="truncate text-xs font-semibold">{store.name}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{live.title}</p>
      </div>
    </Link>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : 0;
  return (
    <Link
      to="/produto/$productId"
      params={{ productId: product.id }}
      className="group block overflow-hidden rounded-2xl bg-surface"
    >
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-40 w-full object-cover transition-transform duration-300 group-active:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
            -{discount}%
          </span>
        )}
      </div>
      <div className="space-y-1 p-2.5">
        <p className="line-clamp-2 text-xs font-medium leading-snug">{product.name}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-primary">{brl(product.price)}</span>
          {product.old_price && (
            <span className="text-[10px] text-muted-foreground line-through">
              {brl(product.old_price)}
            </span>
          )}
        </div>
        <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" /> {product.rating} ·{" "}
          {compact(product.sold)} vendidos
        </p>
      </div>
    </Link>
  );
}

export function StoreRow({ store }: { store: Store }) {
  return (
    <Link
      to="/vendedor/$storeId"
      params={{ storeId: store.id }}
      className="flex min-w-0 items-center gap-3 rounded-2xl bg-surface p-3"
    >
      <Avatar initials={store.avatar} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 truncate text-sm font-semibold">
          {store.name}
          {store.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-accent" />}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {compact(store.followers)} seguidores · ⭐ {store.rating}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
        Ver loja
      </span>
    </Link>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 px-4">
      <h2 className="text-base font-bold tracking-tight">{title}</h2>
      {action && <span className="text-xs font-medium text-muted-foreground">{action}</span>}
    </div>
  );
}
