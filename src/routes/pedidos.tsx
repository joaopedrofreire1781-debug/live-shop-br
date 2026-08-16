import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { brl } from "@/lib/format";
import type { OrderStatus } from "@/lib/data";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Meus pedidos — Vitrine" },
      { name: "description", content: "Acompanhe pagamento, preparo, envio e entrega dos pedidos." },
      { property: "og:title", content: "Meus pedidos — Vitrine" },
      { property: "og:description", content: "Status de todos os seus pedidos no app." },
    ],
  }),
  component: Orders,
});

const statusStyle: Record<OrderStatus, string> = {
  "Pagamento aprovado": "bg-primary/15 text-primary",
  "Preparando pedido": "bg-warning/15 text-warning",
  Enviado: "bg-chart-4/20 text-chart-4",
  Entregue: "bg-success/15 text-success",
};

function Orders() {
  const { orders } = useAppState();

  return (
    <AppShell>
      <PageHeader title="Meus pedidos" />
      <div className="space-y-3 p-4">
        {orders.map((o) => (
          <div key={o.id} className="space-y-3 rounded-2xl bg-surface p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">{o.store_name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {o.code} · {o.created_at}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
                  statusStyle[o.status],
                )}
              >
                {o.status}
              </span>
            </div>
            {o.items.map((i) => (
              <div key={i.product_id} className="flex items-center gap-3">
                <img
                  src={i.image}
                  alt={i.name}
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-medium">{i.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {i.qty}× {brl(i.price)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-2 text-xs">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-primary">{brl(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
