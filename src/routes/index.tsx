import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Search, ShoppingBag, Flame } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { LiveCard, ProductCard, SectionTitle } from "@/components/commerce";
import { CATEGORIES, lives, products } from "@/lib/data";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitrine — compre ao vivo, direto da live" },
      {
        name: "description",
        content:
          "Marketplace brasileiro de live commerce: descubra produtos em lives e vídeos e compre sem sair da transmissão.",
      },
      { property: "og:title", content: "Vitrine — compre ao vivo, direto da live" },
      {
        property: "og:description",
        content: "Lives, vídeos e produtos de vendedores brasileiros em um só app.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { cart } = useAppState();
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <AppShell>
      <header className="sticky top-0 z-30 space-y-3 bg-background/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <span className="truncate text-xl font-black tracking-tight">
            vitrine<span className="text-primary">.</span>
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <Link to="/carrinho" className="relative rounded-full bg-surface p-2">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="relative rounded-full bg-surface p-2" aria-label="Notificações">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </div>
        <Link
          to="/explorar"
          className="flex items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm text-muted-foreground"
        >
          <Search className="h-4 w-4" /> Buscar produtos, lives e lojas
        </Link>
      </header>

      <section className="pt-2">
        <SectionTitle title="Ao vivo agora" action="ver tudo" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-4">
          {lives.map((live) => (
            <LiveCard key={live.id} live={live} />
          ))}
        </div>
      </section>

      <section className="pb-4">
        <SectionTitle title="Categorias" />
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/explorar"
              search={{ cat: c }}
              className="shrink-0 rounded-full bg-surface px-3.5 py-2 text-xs font-medium"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-4">
        <SectionTitle title="Em alta" action="🔥" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
          {products
            .slice()
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5)
            .map((p) => (
              <div key={p.id} className="w-40 shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
        </div>
      </section>

      <section className="pb-6">
        <SectionTitle title="Para você" action="feed" />
        <div className="space-y-4 px-4">
          {lives.map((live, i) => (
            <div key={live.id} className="space-y-3">
              <LiveCard live={live} wide />
              <div className="grid grid-cols-2 gap-3">
                {products.slice(i * 2, i * 2 + 2).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))}
          <p className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-primary" /> Você chegou ao fim do feed de hoje
          </p>
        </div>
      </section>
    </AppShell>
  );
}
