import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Heart, LayoutDashboard, MapPin, Package, ShoppingBag } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Avatar } from "@/components/commerce";
import { currentProfile, getStore } from "@/lib/data";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil — Vitrine" },
      { name: "description", content: "Seus pedidos, lojas seguidas e área do vendedor." },
      { property: "og:title", content: "Meu perfil — Vitrine" },
      { property: "og:description", content: "Gerencie sua conta no marketplace Vitrine." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { orders, following, cart } = useAppState();

  return (
    <AppShell className="max-w-2xl">
      <PageHeader title="Perfil" />
      <div className="space-y-5 p-4">
        <div className="flex items-center gap-3">
          <Avatar initials={currentProfile.avatar} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-black">{currentProfile.name}</p>
            <p className="text-xs text-muted-foreground">{currentProfile.handle}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface p-3 text-center">
          <div>
            <p className="text-sm font-bold">{orders.length}</p>
            <p className="text-[10px] text-muted-foreground">Pedidos</p>
          </div>
          <div>
            <p className="text-sm font-bold">{following.length}</p>
            <p className="text-[10px] text-muted-foreground">Seguindo</p>
          </div>
          <div>
            <p className="text-sm font-bold">{cart.reduce((s, l) => s + l.qty, 0)}</p>
            <p className="text-[10px] text-muted-foreground">No carrinho</p>
          </div>
        </div>

        <div className="space-y-2">
          <Item to="/pedidos" icon={Package} label="Meus pedidos" />
          <Item to="/carrinho" icon={ShoppingBag} label="Carrinho" />
          <Item to="/loja" icon={LayoutDashboard} label="Área do vendedor" />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-bold">Lojas que você segue</h2>
          <div className="space-y-2">
            {following.map((id) => {
              const s = getStore(id);
              return (
                <Link
                  key={id}
                  to="/vendedor/$storeId"
                  params={{ storeId: id }}
                  className="flex items-center gap-3 rounded-2xl bg-surface p-3"
                >
                  <Avatar initials={s.avatar} size="sm" />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">{s.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
            {following.length === 0 && (
              <p className="text-xs text-muted-foreground">Você ainda não segue ninguém.</p>
            )}
          </div>
        </div>

        <div className="space-y-2 pb-6">
          <h2 className="text-sm font-bold">Conta</h2>
          <div className="rounded-2xl bg-surface p-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> Rua das Palmeiras, 240 — São Paulo/SP
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Heart className="h-3.5 w-3.5" /> Protótipo com dados fictícios
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Item({
  to,
  icon: Icon,
  label,
}: {
  to: "/pedidos" | "/carrinho" | "/loja";
  icon: typeof Package;
  label: string;
}) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-2xl bg-surface p-3">
      <Icon className="h-4 w-4 text-primary" />
      <span className="flex-1 text-xs font-medium">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
