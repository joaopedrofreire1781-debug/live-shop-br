import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, MapPin, QrCode, Truck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { brl } from "@/lib/format";
import { getProduct, getStore } from "@/lib/data";
import { cartTotals, placeOrder, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Vitrine" },
      { name: "description", content: "Checkout simulado: endereço, entrega e pagamento." },
      { property: "og:title", content: "Checkout — Vitrine" },
      { property: "og:description", content: "Finalize seu pedido em poucos toques." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { cart } = useAppState();
  const navigate = useNavigate();
  const { subtotal, shipping, total } = cartTotals(cart);
  const [delivery, setDelivery] = useState("expressa");
  const [payment, setPayment] = useState("pix");
  const [address, setAddress] = useState("Rua das Palmeiras, 240 — Pinheiros, São Paulo/SP");

  if (cart.length === 0) {
    return (
      <AppShell className="max-w-2xl">
        <PageHeader title="Checkout" />
        <div className="space-y-4 p-10 text-center">
          <p className="text-sm text-muted-foreground">Nada para finalizar ainda.</p>
          <Link
            to="/"
            className="inline-block rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Voltar para a home
          </Link>
        </div>
      </AppShell>
    );
  }

  const firstProduct = getProduct(cart[0]!.productId)!;
  const storeName = getStore(firstProduct.store_id).name;

  const finish = () => {
    const order = placeOrder(cart, storeName);
    navigate({ to: "/pedido/$orderId", params: { orderId: order.id } });
  };

  return (
    <AppShell className="max-w-2xl">
      <PageHeader title="Checkout" />
      <div className="space-y-5 p-4">
        <section>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
            <MapPin className="h-4 w-4 text-primary" /> Endereço de entrega
          </h2>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="w-full rounded-2xl bg-surface p-3 text-xs outline-none"
          />
        </section>

        <section>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
            <Truck className="h-4 w-4 text-primary" /> Método de entrega
          </h2>
          <div className="space-y-2">
            {[
              { id: "expressa", label: "Expressa — 2 a 3 dias", price: shipping },
              { id: "padrao", label: "Padrão — 5 a 8 dias", price: 0 },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setDelivery(o.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl p-3 text-xs",
                  delivery === o.id ? "bg-surface-2 ring-1 ring-primary" : "bg-surface",
                )}
              >
                <span>{o.label}</span>
                <span className="font-bold">{o.price === 0 ? "Grátis" : brl(o.price)}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
            <CreditCard className="h-4 w-4 text-primary" /> Pagamento
          </h2>
          <div className="space-y-2">
            {[
              { id: "pix", label: "Pix (simulado)", icon: QrCode },
              { id: "cartao", label: "Cartão •••• 4218 (simulado)", icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPayment(id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-2xl p-3 text-xs",
                  payment === id ? "bg-surface-2 ring-1 ring-primary" : "bg-surface",
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-bold">Resumo da compra</h2>
          <div className="space-y-2 rounded-2xl bg-surface p-3">
            {cart.map((l) => {
              const p = getProduct(l.productId)!;
              return (
                <div key={`${l.productId}-${l.variant}`} className="flex justify-between text-xs">
                  <span className="mr-2 line-clamp-1">
                    {l.qty}× {p.name}
                  </span>
                  <span className="shrink-0 font-medium">{brl(p.price * l.qty)}</span>
                </div>
              );
            })}
            <div className="flex justify-between border-t border-border pt-2 text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span>{brl(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Frete</span>
              <span>{delivery === "padrao" || shipping === 0 ? "Grátis" : brl(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-primary">
                {brl(delivery === "padrao" ? subtotal : total)}
              </span>
            </div>
          </div>
        </section>
        <p className="text-center text-[10px] text-muted-foreground">
          Protótipo: nenhum pagamento real é processado.
        </p>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-background/95 p-3 backdrop-blur">
        <button
          onClick={finish}
          className="w-full rounded-full brand-gradient py-3.5 text-sm font-bold uppercase text-primary-foreground glow"
        >
          Finalizar pedido
        </button>
      </div>
    </AppShell>
  );
}
