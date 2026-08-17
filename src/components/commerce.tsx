import { Link } from "@tanstack/react-router";
import { Eye, Star, BadgeCheck } from "lucide-react";
import { brl, compact } from "@/lib/format";
import { getStore, type Live, type Product, type Store } from "@/lib/data";
import { cn } from "@/lib/utils";

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-live px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-live-foreground",
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
        "group relative block shrink-0 overflow-hidden rounded-2xl bg-surface transition-transform duration-200 hover:-translate-y-0.5",
        wide ? "w-full" : "w-56 sm:w-64",
      )}
    >
      <img
        src={live.thumbnail}
        alt={live.title}
        loading="lazy"
        className="aspect-3/4 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        <LiveBadge />
      </div>
      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
        <Eye className="h-3 w-3" /> {compact(live.viewers)}
      </span>
      <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-3">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar initials={store.avatar} size="sm" />
          <span className="truncate text-xs font-semibold text-white">{store.name}</span>
        </div>
        <p className="line-clamp-2 text-sm font-medium text-white/90">{live.title}</p>
      </div>
    </Link>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const store = getStore(product.store_id);
  return (
    <Link
      to="/produto/$productId"
      params={{ productId: product.id }}
      className="group block overflow-hidden rounded-2xl soft-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="aspect-square overflow-hidden bg-surface">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-1.5 p-3.5">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</p>
        <p className="text-base font-bold">{brl(product.price)}</p>
        <p className="truncate text-xs text-muted-foreground">{store.name}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" /> {product.rating}
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
      className="flex min-w-0 items-center gap-3 rounded-2xl soft-card p-3 transition-colors hover:bg-surface"
    >
      <Avatar initials={store.avatar} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 truncate text-sm font-semibold">
          {store.name}
          {store.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />}
        </p>
        <p className="truncate text-xs text-muted-foreground">
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
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {action && <span className="text-xs font-medium text-muted-foreground">{action}</span>}
    </div>
  );
}
