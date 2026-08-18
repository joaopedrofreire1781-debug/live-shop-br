import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ImagePlus, Radio } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { brl } from "@/lib/format";
import { CATEGORIES, lives, productsByStore, type Category } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/criar")({
  head: () => ({
    meta: [
      { title: "Criar live — Vitrine" },
      { name: "description", content: "Configure título, categoria, thumbnail e produtos da sua live." },
      { property: "og:title", content: "Criar live — Vitrine" },
      { property: "og:description", content: "Comece a vender ao vivo em minutos." },
    ],
  }),
  component: CreateLive,
});

function CreateLive() {
  const navigate = useNavigate();
  const myProducts = productsByStore("s-1").concat(productsByStore("s-2"));
  const [title, setTitle] = useState("Drop de inverno — peças únicas");
  const [category, setCategory] = useState<Category>("Moda");
  const [description, setDescription] = useState("Vou mostrar cada peça de perto e responder tudo no chat.");
  const [selected, setSelected] = useState<string[]>(["pr-1"]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const start = () => {
    const target = lives.find((l) => l.category === category) ?? lives[0]!;
    navigate({ to: "/live/$liveId", params: { liveId: target.id } });
  };

  return (
    <AppShell className="max-w-2xl">
      <PageHeader title="Criar live" />
      <div className="space-y-5 p-4">
        <Field label="Título da live">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl bg-surface p-3 text-xs outline-none"
          />
        </Field>

        <Field label="Categoria">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-2 text-xs font-medium",
                  category === c ? "bg-primary text-primary-foreground" : "bg-surface",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Descrição">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-2xl bg-surface p-3 text-xs outline-none"
          />
        </Field>

        <Field label="Thumbnail">
          <button className="grid h-32 w-full place-items-center gap-1 rounded-2xl border border-dashed border-border bg-surface text-xs text-muted-foreground">
            <ImagePlus className="h-5 w-5" />
            Enviar capa (simulado)
          </button>
        </Field>

        <Field label={`Produtos da live (${selected.length})`}>
          <div className="space-y-2">
            {myProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl p-2.5 text-left",
                  selected.includes(p.id) ? "bg-surface-2 ring-1 ring-primary" : "bg-surface",
                )}
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  loading="lazy"
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-medium">{p.name}</p>
                  <p className="text-[11px] text-primary">{brl(p.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-background/95 p-3 backdrop-blur">
        <button
          onClick={start}
          className="flex w-full items-center justify-center gap-2 rounded-full brand-gradient py-3.5 text-sm font-bold uppercase text-primary-foreground glow"
        >
          <Radio className="h-4 w-4" /> Começar live
        </button>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold">{label}</p>
      {children}
    </div>
  );
}
