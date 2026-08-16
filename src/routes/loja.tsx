import { createFileRoute, Link } from "@tanstack/react-router";
import { DollarSign, Eye, Package, Percent, Plus, Radio, ShoppingCart, Store } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { brl } from "@/lib/format";
import { productsByStore } from "@/lib/data";

export const Route = createFileRoute("/loja")({
  head: () => ({
    meta: [
      { title: "Área do vendedor — Vitrine" },
      { name: "description", content: "Vendas, faturamento, pedidos, produtos e conversão da loja." },
      { property: "og:title", content: "Área do vendedor — Vitrine" },
      { property: "og:description", content: "Dashboard do vendedor no marketplace Vitrine." },
    ],
  }),
  component: SellerDashboard,
});

function SellerDashboard() {
  const items = productsByStore("s-1");

  return (
    <AppShell>
      <PageHeader title="Área do vendedor" />
      <div className="space-y-5 p-4">
        <div className="rounded-2xl brand-gradient p-4 text-primary-foreground">
          <p className="text-xs font-medium opacity-80">Faturamento (30 dias)</p>
          <p className="text-3xl font-black">{brl(48720.5)}</p>
          <p className="mt-1 text-xs opacity-80">+18% vs. mês anterior</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Metric icon={ShoppingCart} label="Vendas" value="412" />
          <Metric icon={Package} label="Pedidos abertos" value="27" />
          <Metric icon={Eye} label="Espectadores (lives)" value="9.842" />
          <Metric icon={Percent} label="Conversão" value="6,4%" />
          <Metric icon={DollarSign} label="Ticket médio" value={brl(118.3)} />
          <Metric icon={Store} label="Produtos ativos" value={String(items.length)} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Action to="/criar" icon={Radio} label="Começar live" primary />
          <Action to="/criar" icon={Plus} label="Adicionar produto" />
          <Action to="/loja" icon={Package} label="Gerenciar produtos" />
          <Action to="/pedidos" icon={ShoppingCart} label="Ver pedidos" />
          <Action to="/vendedor/$storeId" icon={Store} label="Editar loja" />
        </div>

        <div className="pb-8">
          <h2 className="mb-2 text-sm font-bold">Seus produtos</h2>
          <div className="space-y-2">
            {items.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-surface p-3">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  loading="lazy"
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-medium">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.stock} em estoque · {p.sold} vendidos
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary">{brl(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-surface p-3">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-lg font-black">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Action({
  to,
  icon: Icon,
  label,
  primary,
}: {
  to: "/criar" | "/loja" | "/pedidos" | "/vendedor/$storeId";
  icon: typeof Eye;
  label: string;
  primary?: boolean;
}) {
  const className = `flex items-center gap-2 rounded-2xl p-3 text-xs font-bold ${
    primary ? "brand-gradient text-primary-foreground glow" : "bg-surface-2"
  }`;
  if (to === "/vendedor/$storeId") {
    return (
      <Link to={to} params={{ storeId: "s-1" }} className={className}>
        <Icon className="h-4 w-4" /> {label}
      </Link>
    );
  }
  return (
    <Link to={to} className={className}>
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}
