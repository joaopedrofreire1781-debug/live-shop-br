import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Radio, Users, Check } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { useSellerState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/seller/live")({
  head: () => ({
    meta: [
      { title: "Criar live — Lance" },
      { name: "description", content: "Monte sua transmissão, escolha produtos e inicie uma live simulada." },
      { property: "og:title", content: "Criar live — Lance" },
      { property: "og:description", content: "Fluxo de criação de live no painel do vendedor." },
    ],
  }),
  component: CreateLive,
});

function CreateLive() {
  const { sellerProducts } = useSellerState();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Tecnologia");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  if (running) {
    return (
      <div className="space-y-5">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-foreground">
          <div className="absolute inset-0 grid place-items-center text-background/60">
            <div className="text-center">
              <Radio className="mx-auto h-8 w-8" />
              <p className="mt-2 text-sm">Transmissão simulada em andamento</p>
            </div>
          </div>
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-live px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-live-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-live-foreground animate-live-dot" /> Ao vivo
          </span>
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-[11px] font-semibold">
            <Users className="h-3 w-3" /> 128
          </span>
        </div>

        <div>
          <h1 className="text-xl font-extrabold tracking-tight">{title || "Sua live"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {category} · {selected.length} produtos na vitrine
          </p>
        </div>

        <button
          onClick={() => setRunning(false)}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface"
        >
          Encerrar live
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Criar live</h1>
        <p className="mt-1 text-sm text-muted-foreground">Transmissão simulada, sem streaming real.</p>
      </div>

      <div className="space-y-4 rounded-2xl soft-card p-5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Título da live</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: iPhones e acessórios ao vivo"
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Categoria</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Descrição</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Imagem de capa</span>
          <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            Upload simulado
          </div>
        </div>
      </div>

      <div className="rounded-2xl soft-card p-5">
        <h2 className="text-sm font-bold">Selecionar produtos</h2>
        <ul className="mt-3 space-y-2">
          {sellerProducts.map((p) => {
            const active = selected.includes(p.id);
            return (
              <li key={p.id}>
                <button
                  onClick={() =>
                    setSelected(active ? selected.filter((id) => id !== p.id) : [...selected, p.id])
                  }
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                    active ? "border-primary bg-accent" : "border-border hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-md border",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {active && <Check className="h-3 w-3" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={() => setRunning(true)}
        className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] sm:w-auto sm:px-8"
      >
        Iniciar live
      </button>
    </div>
  );
}
