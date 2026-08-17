import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Package, Radio, Gavel, Receipt } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/seller")({
  head: () => ({
    meta: [
      { title: "Área do vendedor — Lance" },
      { name: "description", content: "Acompanhe vendas, produtos, lives e leilões da sua loja na Lance." },
      { property: "og:title", content: "Área do vendedor — Lance" },
      { property: "og:description", content: "Painel simples para vender ao vivo e criar leilões." },
    ],
  }),
  component: SellerLayout,
});

const items = [
  { to: "/seller/dashboard", label: "Visão geral", icon: LayoutGrid },
  { to: "/seller/products", label: "Produtos", icon: Package },
  { to: "/seller/live", label: "Lives", icon: Radio },
  { to: "/seller/auction/new", label: "Leilões", icon: Gavel },
  { to: "/seller/orders", label: "Pedidos", icon: Receipt },
] as const;

function SellerLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <AppShell>
      <div className="grid gap-6 py-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-col md:px-0">
          {items.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/seller/dashboard" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-surface",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </AppShell>
  );
}
