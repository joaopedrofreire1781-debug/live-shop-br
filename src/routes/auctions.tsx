import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { AuctionCard } from "@/components/auction";
import { auctions } from "@/lib/auctions";
import { useSellerState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auctions")({
  head: () => ({
    meta: [
      { title: "Leilões ao vivo — Lance" },
      { name: "description", content: "Dispute produtos em tempo real em leilões simulados na plataforma Lance." },
      { property: "og:title", content: "Leilões ao vivo — Lance" },
      { property: "og:description", content: "Acompanhe lances, cronômetro e vendedores em tempo real." },
    ],
  }),
  component: AuctionsPage,
});

const filters = ["Todos", "Terminando agora", "Mais populares", "Começando em breve"] as const;

function AuctionsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const { bids } = useSellerState();

  const list = auctions
    .filter((a) => {
      if (filter === "Terminando agora") return a.status === "live" && a.ends_in <= 300;
      if (filter === "Começando em breve") return a.status === "soon";
      return true;
    })
    .sort((a, b) => {
      if (filter === "Mais populares") return b.bids - a.bids;
      if (filter === "Terminando agora") return a.ends_in - b.ends_in;
      return 0;
    });

  return (
    <AppShell>
      <PageHeader title="Leilões" />
      <p className="-mt-3 text-sm text-muted-foreground">Dispute produtos em tempo real.</p>

      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-surface",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {list.map((a) => {
          const extra = bids[a.id] ?? [];
          const top = extra[0];
          return (
            <AuctionCard
              key={a.id}
              auction={a}
              bids={a.bids + extra.length}
              {...(top ? { amount: Math.max(top.amount, a.current_bid) } : {})}
            />
          );
        })}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Funcionalidade experimental: leilões são uma simulação de interface, sem transações reais.
      </p>
    </AppShell>
  );
}
