import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { brl } from "@/lib/format";
import { getProduct } from "@/lib/data";
import { cartTotals, setQty, useAppState } from "@/lib/store";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho — Vitrine" },
      { name: "description", content: "Revise seus itens, frete e total antes de finalizar." },
      { property: "og:title", content: "Carrinho — Vitrine" },
      { property: "og:description", content: "Seus produtos salvos para compra." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart } = useAppState();
  const { subtotal, shipping, total } = cartTotals(cart);

  return (
    <AppShell className="max-w-2xl">
      <PageHeader title="Carrinho" />
      {cart.length === 0 ? (
        <div className="space-y-4 p-10 text-center">
          <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
          <Link
            to="/"
            className="inline-block rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Descobrir lives
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-2 p-4">
            {cart.map((line) => {
              const p = getProduct(line.productId)!;
              return (
                <div
                  key={`${line.productId}-${line.variant}`}
                  className="flex gap-3 rounded-2xl bg-surface p-3"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-medium">{p.name}</p>
                    {line.variant && (
                      <p className="text-[11px] text-muted-foreground">{line.variant}</p>
                    )}
                    <p className="mt-1 text-sm font-bold text-primary">{brl(p.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQty(line.productId, line.variant, line.qty - 1)}
                        className="grid h-7 w-7 place-items-center rounded-full bg-surface-2"
                        aria-label="Diminuir"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold">{line.qty}</span>
                      <button
                        onClick={() => setQty(line.productId, line.variant, line.qty + 1)}
                        className="grid h-7 w-7 place-items-center rounded-full bg-surface-2"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setQty(line.productId, line.variant, 0)}
                        className="ml-auto text-muted-foreground"
                        aria-label="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 px-4 text-sm">
            <Row label="Subtotal" value={brl(subtotal)} />
            <Row label="Frete simulado" value={shipping === 0 ? "Grátis" : brl(shipping)} />
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-primary">{brl(total)}</span>
            </div>
          </div>

          <div className="sticky bottom-0 mt-4 border-t border-border bg-background/95 p-3 backdrop-blur">
            <Link
              to="/checkout"
              className="block rounded-full brand-gradient py-3.5 text-center text-sm font-bold text-primary-foreground glow"
            >
              Continuar para pagamento
            </Link>
          </div>
        </>
      )}
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
