import { createFileRoute } from "@tanstack/react-router";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/seller/orders")({
  head: () => ({
    meta: [
      { title: "Pedidos da loja — Lance" },
      { name: "description", content: "Pedidos simulados recebidos pela sua loja na Lance." },
      { property: "og:title", content: "Pedidos da loja — Lance" },
      { property: "og:description", content: "Acompanhe o status dos pedidos da sua loja." },
    ],
  }),
  component: SellerOrders,
});

const rows = [
  { code: "VT-8412", buyer: "@carlos", total: 899, status: "Enviado" },
  { code: "VT-8409", buyer: "@ana", total: 3899, status: "Preparando" },
  { code: "VT-8398", buyer: "@lucas", total: 749, status: "Entregue" },
  { code: "VT-8390", buyer: "@bia.mtos", total: 1249, status: "Entregue" },
];

function SellerOrders() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Pedidos</h1>
      <ul className="divide-y divide-border overflow-hidden rounded-2xl soft-card">
        {rows.map((r) => (
          <li key={r.code} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{r.code}</p>
              <p className="truncate text-xs text-muted-foreground">
                {r.buyer} · {r.status}
              </p>
            </div>
            <span className="shrink-0 text-sm font-bold">{brl(r.total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
