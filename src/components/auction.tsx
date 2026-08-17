import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Timer, Gavel } from "lucide-react";
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
          <p className="text-xl font-extrabold tracking-tight">{brl(amount ?? auction.current_bid)}</p>
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
