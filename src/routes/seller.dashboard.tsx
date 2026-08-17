import { createFileRoute } from "@tanstack/react-router";
import { Radio, PackagePlus, Gavel, CheckCircle2 } from "lucide-react";
import { useSellerState } from "@/lib/store";

export const Route = createFileRoute("/seller/dashboard")({
  head: () => ({
    meta: [
      { title: "Visão geral do vendedor — Lance" },
      { name: "description", content: "Métricas simuladas de vendas, produtos, lives e leilões da sua loja." },
      { property: "og:title", content: "Visão geral do vendedor — Lance" },
      { property: "og:description", content: "Acompanhe o desempenho da sua loja na Lance." },
    ],
  }),
  component: SellerDashboard,
});

const activity = [
  { icon: Radio, label: "Live iniciada", detail: "iPhones e acessórios", time: "há 12 min" },
  { icon: PackagePlus, label: "Produto cadastrado", detail: "Relógio smart aço inox", time: "há 2 h" },
  { icon: Gavel, label: "Leilão encerrado", detail: "Fone ANC — R$ 468", time: "ontem" },
  { icon: CheckCircle2, label: "Venda realizada", detail: "Pedido VT-8412 — R$ 899", time: "ontem" },
];

function SellerDashboard() {
  const { sellerProducts, sellerAuctions } = useSellerState();

  const metrics = [
    { value: "R$ 12.480", label: "Vendas" },
    { value: String(sellerProducts.length + 19), label: "Produtos" },
    { value: "8", label: "Lives" },
    { value: String(5 + sellerAuctions.length), label: "Leilões" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Visão geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">Dados simulados dos últimos 30 dias.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl soft-card p-4">
            <p className="text-2xl font-extrabold tracking-tight">{m.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold tracking-tight">Atividade recente</h2>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl soft-card">
          {activity.map(({ icon: Icon, label, detail, time }) => (
            <li key={label} className="flex items-center gap-3 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{label}</p>
                <p className="truncate text-xs text-muted-foreground">{detail}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
