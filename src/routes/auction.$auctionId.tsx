import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, ArrowLeft, Gavel, Crown } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Avatar, LiveBadge } from "@/components/commerce";
import { CountdownBar, LiveVideoPlayer, useCountdown } from "@/components/auction";
import { getAuction, seedBids } from "@/lib/auctions";
import { getStore } from "@/lib/data";
import { brl } from "@/lib/format";
import { placeBid, useSellerState } from "@/lib/store";

export const Route = createFileRoute("/auction/$auctionId")({
  head: () => ({
    meta: [
      { title: "Leilão ao vivo — Lance" },
      { name: "description", content: "Acompanhe o lance atual, o cronômetro e o histórico de lances." },
      { property: "og:title", content: "Leilão ao vivo — Lance" },
      { property: "og:description", content: "Simulação de leilão em tempo real na plataforma Lance." },
    ],
  }),
  loader: ({ params }) => {
    if (!getAuction(params.auctionId)) throw notFound();
    return null;
  },
  component: AuctionPage,
});

function AuctionPage() {
  const { auctionId } = Route.useParams();
  const auction = getAuction(auctionId)!;
  const store = getStore(auction.store_id);
  const { bids } = useSellerState();

  const seeded = useMemo(() => seedBids(auction), [auction]);
  const live = bids[auctionId] ?? [];
  const history = [
    ...live.map((b) => ({ id: b.id, user: b.user, amount: b.amount, ago: 0 })),
    ...seeded,
  ];

  const current = history[0]?.amount ?? auction.current_bid;
  const totalBids = auction.bids + live.length;
  const leader = history[0]?.user ?? auction.leader;
  const youLead = leader === "@voce";

  const left = useCountdown(auction.ends_in);
  const ended = left <= 0;

  const [value, setValue] = useState<string>(String(auction.current_bid + auction.increment));
  const [error, setError] = useState<string | null>(null);

  const min = current + auction.increment;

  function submit() {
    const amount = Number(value.replace(/[^\d]/g, ""));
    if (!amount || amount < min) {
      setError(`O lance mínimo é ${brl(min)}.`);
      return;
    }
    setError(null);
    placeBid(auctionId, amount);
    setValue(String(amount + auction.increment));
  }

  return (
    <AppShell>
      <div className="py-5">
        <Link to="/auctions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Leilões
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-4">
          {auction.status === "live" ? (
            <LiveVideoPlayer poster={auction.image} title={auction.title} viewers={120 + auction.bids * 7} />
          ) : (
            <div className="relative overflow-hidden rounded-2xl bg-surface">
              <img
                src={auction.image}
                alt={auction.title}
                width={800}
                height={600}
                className="aspect-video w-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[auction.image, auction.image, auction.image].map((src, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-surface">
                <img src={src} alt={`${auction.title} — foto ${i + 1}`} loading="lazy" className="aspect-4/3 w-full object-cover" />
              </div>
            ))}
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{auction.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{auction.description}</p>
          </div>

          <Link
            to="/vendedor/$storeId"
            params={{ storeId: store.id }}
            className="flex items-center gap-3 rounded-2xl soft-card p-3"
          >
            <Avatar initials={store.avatar} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{store.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-warning text-warning" /> {store.rating} · {store.city}
              </p>
            </div>
            <span className="text-xs font-medium text-primary">Ver loja</span>
          </Link>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl soft-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {ended ? "Leilão encerrado" : "Leilão ao vivo"}
              </p>
              {!ended && auction.status === "live" && <LiveBadge />}
            </div>

            {ended ? (
              <div className="mt-4 rounded-xl bg-success/10 p-4">
                <p className="text-sm font-semibold text-success">Lance vencedor</p>
                <p className="mt-1 text-4xl font-black tracking-tight text-success">{brl(current)}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-sm font-bold text-success">
                  <Crown className="h-4 w-4" /> {leader}
                </p>
              </div>
            ) : (
              <>
                <div className="mt-3 rounded-2xl bg-surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lance atual</p>
                  <p className="mt-0.5 text-5xl font-black leading-none tracking-tighter text-primary tabular-nums">
                    {brl(current)}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Vencendo</span>
                    <span
                      className={
                        youLead
                          ? "inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-sm font-extrabold text-success"
                          : "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-extrabold text-primary"
                      }
                    >
                      <Crown className="h-3.5 w-3.5" />
                      {youLead ? "Você" : leader}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="rounded-xl bg-surface p-3">
                    <p className="text-xs text-muted-foreground">Lances</p>
                    <p className="font-bold tabular-nums">{totalBids}</p>
                  </div>
                  <CountdownBar left={left} total={auction.ends_in} />
                </div>

                <label className="mt-5 block text-xs font-medium text-muted-foreground" htmlFor="bid">
                  Seu lance (mínimo {brl(min)})
                </label>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-input px-3 py-2 focus-within:border-primary">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <input
                    id="bid"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-transparent text-base font-semibold outline-none"
                  />
                </div>
                {error && <p className="mt-1.5 text-xs text-live">{error}</p>}

                <div className="mt-2 flex gap-2">
                  {[1, 2, 5].map((m) => (
                    <button
                      key={m}
                      onClick={() => setValue(String(current + auction.increment * m))}
                      className="flex-1 rounded-lg bg-surface py-2 text-xs font-semibold text-muted-foreground hover:bg-surface-2"
                    >
                      +{brl(auction.increment * m)}
                    </button>
                  ))}
                </div>

                <button
                  onClick={submit}
                  className="mt-3 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
                >
                  Dar lance
                </button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Simulação de interface — nenhum pagamento é processado.
                </p>
              </>
            )}
          </div>

          <div className="rounded-2xl soft-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Gavel className="h-4 w-4" /> Histórico de lances
            </h2>
            <ul className="mt-3 divide-y divide-border">
              {history.length === 0 && (
                <li className="py-3 text-sm text-muted-foreground">Nenhum lance ainda. Seja o primeiro.</li>
              )}
              {history.slice(0, 10).map((b, i) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-lg px-2 py-2.5 animate-bid-enter"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {b.user === "@voce" ? "Você" : b.user}
                      {i === 0 && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          liderando
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.ago === 0 ? "agora" : `há ${b.ago} segundos`}
                    </p>
                  </div>
                  <span className={i === 0 ? "text-base font-extrabold text-primary" : "text-sm text-muted-foreground"}>
                    {brl(b.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
