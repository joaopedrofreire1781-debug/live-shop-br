import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { brl } from "@/lib/format";
import { getOrder, useAppState } from "@/lib/store";

export const Route = createFileRoute("/pedido/$orderId")({
  head: () => ({
    meta: [
      { title: "Pedido confirmado — Vitrine" },
      { name: "description", content: "Seu pedido simulado foi confirmado com sucesso." },
      { property: "og:title", content: "Pedido confirmado — Vitrine" },
      { property: "og:description", content: "Acompanhe o status do pedido no app." },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const { orderId } = Route.useParams();
  useAppState();
  const order = getOrder(orderId);

  return (
    <AppShell>
      <div className="flex flex-col items-center gap-4 px-6 pb-6 pt-16 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-success/15">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </span>
        <h1 className="text-xl font-black">Pedido confirmado!</h1>
        <p className="text-xs text-muted-foreground">
          {order
            ? `Código ${order.code} · pagamento aprovado (simulado). Você recebe atualizações no app.`
            : "Pedido registrado no protótipo."}
        </p>

        {order && (
          <div className="w-full space-y-2 rounded-2xl bg-surface p-3 text-left">
            {order.items.map((i) => (
              <div key={i.product_id} className="flex items-center gap-3">
                <img
                  src={i.image}
                  alt={i.name}
                  loading="lazy"
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-medium">{i.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {i.qty}× {brl(i.price)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
              <span>Total</span>
              <span className="text-primary">{brl(order.total)}</span>
            </div>
          </div>
        )}

        <div className="w-full space-y-2 pt-2">
          <Link
            to="/pedidos"
            className="block rounded-full brand-gradient py-3.5 text-sm font-bold text-primary-foreground glow"
          >
            Ver meus pedidos
          </Link>
          <Link to="/" className="block rounded-full bg-surface-2 py-3.5 text-sm font-bold">
            Voltar para as lives
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
