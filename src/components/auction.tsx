import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Timer, Gavel, Volume2, VolumeX, Radio } from "lucide-react";
import { brl } from "@/lib/format";
import { getStore } from "@/lib/data";
import { formatClock, type Auction } from "@/lib/auctions";
import { cn } from "@/lib/utils";
import { Avatar, LiveBadge } from "@/components/commerce";

export function useCountdown(initial: number) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    setLeft(initial);
    const id = setInterval(() => setLeft((v) => (v <= 0 ? 0 : v - 1)), 1000);
    return () => clearInterval(id);
  }, [initial]);
  return left;
}

export function Countdown({ seconds, className }: { seconds: number; className?: string }) {
  const left = useCountdown(seconds);
  const urgent = left <= 60;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold tabular-nums",
        urgent ? "text-live" : "text-foreground",
        className,
      )}
    >
      <Timer className="h-3.5 w-3.5" />
      {formatClock(left)}
    </span>
  );
}

/** Cronômetro com barra de progresso: neutro → âmbar (<30s) → vermelho pulsante (<10s). */
export function CountdownBar({ left, total }: { left: number; total: number }) {
  const pct = total > 0 ? Math.max(0, Math.min(100, (left / total) * 100)) : 0;
  const critical = left <= 10;
  const warning = !critical && left <= 30;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-muted-foreground">Tempo restante</span>
        <span
          className={cn(
            "font-mono text-2xl font-extrabold tabular-nums transition-colors",
            critical ? "text-live animate-urgent" : warning ? "text-warning" : "text-foreground",
          )}
        >
          {formatClock(left)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn(
            "h-full rounded-full transition-[width,background-color] duration-1000 ease-linear",
            critical ? "bg-live animate-urgent" : warning ? "bg-warning" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {critical && left > 0 && (
        <p className="text-xs font-semibold text-live">Últimos segundos — dê seu lance agora!</p>
      )}
    </div>
  );
}

/** Player simulado de transmissão ao vivo (nenhum stream real). */
export function LiveVideoPlayer({ poster, title, viewers }: { poster: string; title: string; viewers: number }) {
  const [muted, setMuted] = useState(true);
  const [count, setCount] = useState(viewers);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setCount((v) => Math.max(20, v + Math.floor(Math.random() * 9) - 3)), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={ref} className="relative aspect-video w-full overflow-hidden rounded-2xl bg-foreground">
      <img src={poster} alt={title} className="h-full w-full object-cover opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-foreground/70 via-transparent to-foreground/30" />
      <div className="pointer-events-none absolute inset-0 animate-scan bg-linear-to-b from-transparent via-background/10 to-transparent" />

      <div className="absolute left-3 top-3 flex items-center gap-2">
        <LiveBadge />
        <span className="inline-flex items-center gap-1 rounded-md bg-foreground/60 px-2 py-1 text-[10px] font-semibold text-background backdrop-blur">
          <Radio className="h-3 w-3" /> {count} assistindo
        </span>
      </div>

      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Ativar som" : "Silenciar"}
        className="absolute right-3 top-3 rounded-full bg-foreground/60 p-2 text-background backdrop-blur transition-transform active:scale-95"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      <div className="absolute inset-x-3 bottom-3 flex items-center gap-3">
        <p className="min-w-0 flex-1 truncate text-xs font-semibold text-background">{title}</p>
        <span className="shrink-0 rounded-md bg-background/20 px-2 py-1 text-[10px] font-medium text-background backdrop-blur">
          Transmissão simulada
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-background/20">
        <div className="h-full w-full bg-live/80" />
      </div>
    </div>
  );
}

export function AuctionCard({ auction, bids, amount }: { auction: Auction; bids?: number; amount?: number }) {
  const store = getStore(auction.store_id);
  return (
    <Link
      to="/auction/$auctionId"
      params={{ auctionId: auction.id }}
      className="group flex w-full flex-col overflow-hidden rounded-2xl soft-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-surface">
        <img
          src={auction.image}
          alt={auction.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          {auction.status === "live" ? (
            <LiveBadge />
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur">
              <Gavel className="h-3 w-3" /> Em breve
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{auction.title}</p>

        <div className="mt-auto">
          <p className="text-xs text-muted-foreground">Lance atual</p>
          <p className="text-xl font-extrabold tracking-tight text-primary">{brl(amount ?? auction.current_bid)}</p>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>{bids ?? auction.bids} lances</span>
          <Countdown seconds={auction.ends_in} className="text-xs" />
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <Avatar initials={store.avatar} size="sm" />
          <span className="truncate text-xs text-muted-foreground">{store.name}</span>
        </div>
      </div>
    </Link>
  );
}
