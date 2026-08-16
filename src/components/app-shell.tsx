import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, PlusCircle, Package, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/criar", label: "Criar", icon: PlusCircle },
  { to: "/pedidos", label: "Pedidos", icon: Package },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
      <ul className="grid grid-cols-5">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          const isCreate = to === "/criar";
          return (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", isCreate && "h-7 w-7 text-primary")} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
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
  return (
    <div className="flex min-h-screen justify-center">
      <div className="relative flex min-h-screen w-full max-w-[430px] flex-col bg-background shadow-[0_0_60px_-20px_rgba(0,0,0,0.9)]">
        <main className={cn("flex-1 animate-rise", className)}>{children}</main>
        {nav ? <BottomNav /> : null}
      </div>
    </div>
  );
}

export function PageHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
      <h1 className="truncate text-lg font-bold tracking-tight">{title}</h1>
      {right}
    </header>
  );
}
