import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { addSellerProduct, useSellerState } from "@/lib/store";
import { brl } from "@/lib/format";
import { CATEGORIES } from "@/lib/data";

export const Route = createFileRoute("/seller/products")({
  head: () => ({
    meta: [
      { title: "Meus produtos — Lance" },
      { name: "description", content: "Cadastre e gerencie os produtos da sua loja na Lance." },
      { property: "og:title", content: "Meus produtos — Lance" },
      { property: "og:description", content: "Lista de produtos, preços e estoque da sua loja." },
    ],
  }),
  component: SellerProducts,
});

function SellerProducts() {
  const { sellerProducts } = useSellerState();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", category: "Tecnologia", description: "" });
  const [saved, setSaved] = useState(false);

  function save() {
    if (!form.name.trim() || !form.price) return;
    addSellerProduct({
      name: form.name.trim(),
      price: Number(form.price.replace(/[^\d]/g, "")),
      category: form.category,
      stock: 1,
    });
    setForm({ name: "", price: "", category: "Tecnologia", description: "" });
    setOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h1 className="truncate text-2xl font-extrabold tracking-tight">Meus produtos</h1>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Adicionar produto
        </button>
      </div>

      {saved && (
        <p className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success animate-rise">
          Produto salvo no estado local.
        </p>
      )}

      <ul className="divide-y divide-border overflow-hidden rounded-2xl soft-card">
        {sellerProducts.map((p) => (
          <li key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {p.category} · estoque {p.stock}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold">{brl(p.price)}</p>
              <p
                className={
                  p.status === "Ativo" ? "text-xs font-medium text-success" : "text-xs text-muted-foreground"
                }
              >
                {p.status}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-foreground/40 p-0 sm:place-items-center sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl bg-background p-5 animate-rise sm:rounded-2xl">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="text-lg font-bold tracking-tight">Adicionar produto</h2>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="rounded-full p-1.5 hover:bg-surface">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <Field label="Nome">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="Ex: Fone bluetooth ANC"
                />
              </Field>
              <Field label="Preço (R$)">
                <input
                  value={form.price}
                  inputMode="numeric"
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="899"
                />
              </Field>
              <Field label="Categoria">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Descrição">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="Detalhes do produto"
                />
              </Field>
              <Field label="Imagem">
                <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                  Upload simulado — nenhuma imagem é enviada nesta demonstração.
                </div>
              </Field>
            </div>

            <button
              onClick={save}
              className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
            >
              Salvar produto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
