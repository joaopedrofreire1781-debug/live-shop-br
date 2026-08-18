import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { addSellerAuction, useSellerState } from "@/lib/store";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/seller/auction/new")({
  head: () => ({
    meta: [
      { title: "Criar leilão — Lance" },
      { name: "description", content: "Configure produto, lance inicial, incremento e duração de um leilão simulado." },
      { property: "og:title", content: "Criar leilão — Lance" },
      { property: "og:description", content: "Fluxo de criação de leilão no painel do vendedor." },
    ],
  }),
  component: NewAuction,
});

function NewAuction() {
  const { sellerProducts, sellerAuctions } = useSellerState();
  const [form, setForm] = useState({
    product: "",
    start_price: "1500",
    increment: "50",
    minutes: "5",
    description: "",
  });
  const [done, setDone] = useState(false);

  function create() {
    const product = form.product || sellerProducts[0]?.name || "Produto";
    addSellerAuction({
      product,
      start_price: Number(form.start_price) || 0,
      increment: Number(form.increment) || 0,
      minutes: Number(form.minutes) || 5,
      description: form.description,
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-success/10 p-6 animate-rise">
          <CheckCircle2 className="h-7 w-7 text-success" />
          <h1 className="mt-3 text-xl font-extrabold tracking-tight">Leilão criado</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Salvo apenas no estado local desta demonstração.
          </p>
        </div>
        <button
          onClick={() => setDone(false)}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface"
        >
          Criar outro leilão
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Criar leilão</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Funcionalidade experimental — simulação de interface, sem transações reais.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl soft-card p-5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Produto</span>
          <select
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="">Selecione um produto</option>
            {sellerProducts.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Lance inicial (R$)</span>
            <input
              value={form.start_price}
              inputMode="numeric"
              onChange={(e) => setForm({ ...form, start_price: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Incremento (R$)</span>
            <input
              value={form.increment}
              inputMode="numeric"
              onChange={(e) => setForm({ ...form, increment: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Duração (min)</span>
            <input
              value={form.minutes}
              inputMode="numeric"
              onChange={(e) => setForm({ ...form, minutes: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Descrição</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </label>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Imagem</span>
          <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            Upload simulado
          </div>
        </div>
      </div>

      <button
        onClick={create}
        className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] sm:w-auto sm:px-8"
      >
        Criar leilão
      </button>

      {sellerAuctions.length > 0 && (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl soft-card">
          {sellerAuctions.map((a) => (
            <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{a.product}</p>
                <p className="text-xs text-muted-foreground">
                  {a.minutes} min · incremento {brl(a.increment)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold">{brl(a.start_price)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
