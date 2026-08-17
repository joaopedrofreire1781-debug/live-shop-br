import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, Gavel, Radio, User, Search, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/lib/store";

const mobileTabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/auctions", label: "Leilões", icon: Gavel },
  { to: "/ao-vivo", label: "Ao Vivo", icon: Radio },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

const desktopNav = [
  { to: "/", label: "Home" },
  { to: "/explorar", label: "Explorar" },
  { to: "/auctions", label: "Leilões" },
  { to: "/ao-vivo", label: "Ao Vivo" },
] as const;

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {mobileTabs.map(({ to, label, icon: Icon }) => {
          const active = isActive(pathname, to);
          return (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { cart } = useAppState();
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-6">
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          lance<span className="text-primary">.</span>
        </Link>

        <Link
          to="/explorar"
          className="hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 md:flex"
        >
          <Search className="h-4 w-4" />
          Pesquisar produtos, vendedores ou lives...
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
          <nav className="mr-2 hidden items-center gap-1 lg:flex">
            {desktopNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(pathname, item.to)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/carrinho"
            aria-label="Carrinho"
            className="relative rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/perfil"
            className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Entrar
          </Link>

          <Link
            to="/seller"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Criar
          </Link>
        </div>
      </div>
    </header>
  );
}

export function AppShell({
  children,
  nav = true,
  className,
}: {
  children: ReactNode;
  nav?: boolean;
  className?: string;
}) {
  if (!nav) {
    return (
      <div className="flex min-h-screen justify-center bg-surface">
        <div className="relative flex min-h-screen w-full max-w-[430px] flex-col bg-background">
          <main className={cn("flex-1 animate-rise", className)}>{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className={cn("mx-auto w-full max-w-6xl flex-1 animate-rise px-4 pb-10 md:px-6", className)}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export function PageHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-5">
      <h1 className="truncate text-2xl font-extrabold tracking-tight">{title}</h1>
      {right}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight md:text-xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
