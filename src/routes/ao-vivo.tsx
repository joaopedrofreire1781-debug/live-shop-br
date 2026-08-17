import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { LiveCard } from "@/components/commerce";
import { lives } from "@/lib/data";

export const Route = createFileRoute("/ao-vivo")({
  head: () => ({
    meta: [
      { title: "Ao vivo agora — Lance" },
      {
        name: "description",
        content: "Assista às transmissões de vendedores brasileiros e compre direto da live.",
      },
      { property: "og:title", content: "Ao vivo agora — Lance" },
      { property: "og:description", content: "Lives de tecnologia, moda, games e colecionáveis acontecendo agora." },
    ],
  }),
  component: AoVivo,
});

function AoVivo() {
  return (
    <AppShell>
      <PageHeader title="Ao vivo" />
      <p className="-mt-3 mb-6 text-sm text-muted-foreground">
        {lives.length} transmissões acontecendo neste momento.
      </p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {lives.map((live) => (
          <LiveCard key={live.id} live={live} wide />
        ))}
      </div>
    </AppShell>
  );
}
