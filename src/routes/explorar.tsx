import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { LiveCard, ProductCard, SectionTitle, StoreRow } from "@/components/commerce";
import { CATEGORIES, lives, products, stores, type Category } from "@/lib/data";
import { cn } from "@/lib/utils";

type SearchParams = { cat?: Category };

export const Route = createFileRoute("/explorar")({
  validateSearch: (s: Record<string, unknown>): SearchParams =>
    typeof s['cat'] === "string" && (CATEGORIES as string[]).includes(s['cat'])
      ? { cat: s['cat'] as Category }
      : {},
  head: () => ({
    meta: [
      { title: "Explorar — Vitrine" },
      {
        name: "description",
        content: "Descubra lives, vídeos, produtos populares e vendedores por categoria.",
      },
      { property: "og:title", content: "Explorar — Vitrine" },
      { property: "og:description", content: "Categorias, produtos populares e lives em destaque." },
    ],
  }),
  component: Explorar,
});

function Explorar() {
  const { cat } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState("");

  const filtered = products.filter(
    (p) =>
      (!cat || p.category === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const filteredLives = lives.filter((l) => !cat || l.category === cat);

  return (
    <AppShell>
      <header className="sticky top-0 z-30 space-y-3 bg-background/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="O que você procura?"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          <button
            onClick={() => navigate({ search: {} })}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-xs font-medium",
              !cat ? "bg-primary text-primary-foreground" : "bg-surface",
            )}
          >
            Tudo
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => navigate({ search: { cat: c } })}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-xs font-medium",
                cat === c ? "bg-primary text-primary-foreground" : "bg-surface",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {filteredLives.length > 0 && (
        <section className="pt-2">
          <SectionTitle title="Lives e vídeos" />
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-4">
            {filteredLives.map((l) => (
              <LiveCard key={l.id} live={l} />
            ))}
          </div>
        </section>
      )}

      <section className="pb-6">
        <SectionTitle title="Produtos populares" action={`${filtered.length} itens`} />
        <div className="grid grid-cols-2 gap-3 px-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Nada encontrado por aqui.
          </p>
        )}
      </section>

      <section className="pb-8">
        <SectionTitle title="Vendedores populares" />
        <div className="space-y-2 px-4">
          {stores.map((s) => (
            <StoreRow key={s.id} store={s} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
