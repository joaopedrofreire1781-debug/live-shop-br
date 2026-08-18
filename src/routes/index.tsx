import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cpu,
  Shirt,
  Gamepad2,
  Sparkles,
  Home as HomeIcon,
  Dumbbell,
  Gem,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { AppShell, SectionHeader } from "@/components/app-shell";
import { LiveCard, ProductCard } from "@/components/commerce";
import { AuctionCard } from "@/components/auction";
import { auctions } from "@/lib/auctions";
import { lives, products, type Category } from "@/lib/data";
import { useSellerState } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lance — compre, assista e dê seu lance" },
      {
        name: "description",
        content:
          "Marketplace brasileiro com lives de venda e leilões em tempo real. Descubra produtos, assista transmissões e participe de disputas.",
      },
      { property: "og:title", content: "Lance — compre, assista e dê seu lance" },
      {
        property: "og:description",
        content: "Produtos, lives e leilões acontecendo agora em um só lugar.",
      },
    ],
  }),
  component: Home,
});

const categoryIcons: { label: Category; icon: typeof Cpu }[] = [
  { label: "Tecnologia", icon: Cpu },
  { label: "Moda", icon: Shirt },
  { label: "Games", icon: Gamepad2 },
  { label: "Colecionáveis", icon: Gem },
  { label: "Beleza", icon: Sparkles },
  { label: "Casa", icon: HomeIcon },
  { label: "Esportes", icon: Dumbbell },
  { label: "Eletrônicos", icon: Headphones },
];

function Home() {
  const { bids } = useSellerState();
  const liveAuctions = auctions.filter((a) => a.status === "live").slice(0, 4);
  const trending = products.slice().sort((a, b) => b.sold - a.sold).slice(0, 8);

  const feed = [
    { kind: "product", item: products[8]! },
    { kind: "live", item: lives[5]! },
    { kind: "auction", item: auctions[1]! },
    { kind: "product", item: products[10]! },
    { kind: "live", item: lives[6]! },
    { kind: "auction", item: auctions[3]! },
  ] as const;

  return (
    <AppShell>
      {/* Hero compacto */}
      <section className="grid items-center gap-8 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:py-14">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Compre. Assista. Dê seu lance.
          </h1>
          <p className="mt-3 max-w-md text-base text-muted-foreground">
            Produtos, lives e leilões acontecendo agora.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/explorar"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explorar agora
            </Link>
            <Link
              to="/auctions"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface"
            >
              Ver leilões
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <img
            src={lives[4]!.thumbnail}
            alt="Vendedor transmitindo ao vivo"
            width={900}
            height={1200}
            className="col-span-2 row-span-2 aspect-3/4 w-full rounded-2xl object-cover"
          />
          <img
            src={products[8]!.images[0]}
            alt={products[8]!.name}
            width={800}
            height={800}
            loading="lazy"
            className="aspect-square w-full rounded-2xl object-cover"
          />
          <img
            src={products[10]!.images[0]}
            alt={products[10]!.name}
            width={800}
            height={800}
            loading="lazy"
            className="aspect-square w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      {/* Ao vivo agora */}
      <section className="py-8">
        <SectionHeader
          title="Ao vivo agora"
          action={
            <Link to="/ao-vivo" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Ver tudo <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {lives.slice(4, 9).map((live) => (
            <LiveCard key={live.id} live={live} />
          ))}
        </div>
      </section>

      {/* Leilões agora */}
      <section className="py-8">
        <SectionHeader
          title="Leilões agora"
          subtitle="Produtos recebendo lances neste momento."
          action={
            <Link to="/auctions" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Ver tudo <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {liveAuctions.map((a) => {
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
      </section>

      {/* Produtos em alta */}
      <section className="py-8">
        <SectionHeader
          title="Produtos em alta"
          action={
            <Link to="/explorar" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Ver tudo <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="py-8">
        <SectionHeader title="Explore por categoria" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categoryIcons.map(({ label, icon: Icon }) => (
            <Link
              key={label}
              to="/explorar"
              search={{ cat: label }}
              className="flex items-center gap-3 rounded-xl soft-card px-4 py-3 text-sm font-medium transition-colors hover:bg-surface"
            >
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Para você */}
      <section className="py-8">
        <SectionHeader title="Para você" subtitle="Produtos, lives e leilões misturados." />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {feed.map((entry, i) => {
            if (entry.kind === "product") return <ProductCard key={`f-${i}`} product={entry.item} />;
            if (entry.kind === "live") return <LiveCard key={`f-${i}`} live={entry.item} wide />;
            return <AuctionCard key={`f-${i}`} auction={entry.item} />;
          })}
        </div>
      </section>
    </AppShell>
  );
}
