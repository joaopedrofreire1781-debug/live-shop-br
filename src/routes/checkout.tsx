import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CreditCard, Loader2, MapPin, QrCode, Truck } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { brl } from "@/lib/format";
import { getProduct, getStore } from "@/lib/data";
import { cartTotals, placeOrder, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Lance" },
      { name: "description", content: "Checkout simulado em etapas: endereço, frete, pagamento e revisão." },
      { property: "og:title", content: "Checkout — Lance" },
      { property: "og:description", content: "Finalize seu pedido em poucos toques." },
    ],
  }),
  component: Checkout,
});

const STEPS = ["Endereço", "Frete", "Pagamento", "Revisão"] as const;

const SHIPPING_OPTIONS = [
  { id: "padrao", label: "Padrão", eta: "5 a 8 dias úteis", price: 15.9 },
  { id: "expresso", label: "Expresso", eta: "1 a 2 dias úteis", price: 29.9 },
] as const;

type Address = {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

const emptyAddress: Address = { cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "" };

function Checkout() {
  const { cart } = useAppState();
  const navigate = useNavigate();
  const { subtotal } = cartTotals(cart);

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [shippingId, setShippingId] = useState<string | null>(null);
  const [payment, setPayment] = useState("pix");

  const shippingOption = SHIPPING_OPTIONS.find((o) => o.id === shippingId) ?? null;
  const shipping = shippingOption?.price ?? 0;
  const total = subtotal + shipping;

  const cepDigits = address.cep.replace(/\D/g, "");
  const cepFilled = cepDigits.length === 8;
  const addressComplete = cepFilled && !!address.rua.trim() && !!address.numero.trim() && !!address.cidade.trim();

  async function lookupCep(raw: string) {
    const digits = raw.replace(/\D/g, "");
    setAddress((a) => ({ ...a, cep: digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5, 8)}` : digits }));
    if (digits.length !== 8) {
      setCepStatus("idle");
      return;
    }
    setCepStatus("loading");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = (await res.json()) as {
        erro?: boolean | string;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (data.erro) {
        setCepStatus("error");
        return;
      }
      setAddress((a) => ({
        ...a,
        rua: data.logradouro ?? a.rua,
        bairro: data.bairro ?? a.bairro,
        cidade: data.localidade ?? a.cidade,
        uf: data.uf ?? a.uf,
      }));
      setCepStatus("ok");
    } catch {
      setCepStatus("error");
    }
  }

  if (cart.length === 0) {
    return (
      <AppShell className="max-w-2xl">
        <PageHeader title="Checkout" />
        <div className="space-y-4 p-10 text-center">
          <p className="text-sm text-muted-foreground">Nada para finalizar ainda.</p>
          <Link
            to="/"
            className="inline-block rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Voltar para a home
          </Link>
        </div>
      </AppShell>
    );
  }

  const firstProduct = getProduct(cart[0]!.productId)!;
  const storeName = getStore(firstProduct.store_id).name;

  const canAdvance =
    step === 0 ? addressComplete : step === 1 ? !!shippingOption : step === 2 ? !!payment : true;

  const finish = () => {
    const order = placeOrder(cart, storeName);
    navigate({ to: "/pedido/$orderId", params: { orderId: order.id } });
  };

  return (
    <AppShell className="max-w-5xl">
      <PageHeader title="Checkout" />

      {/* Indicador de progresso */}
      <div className="px-4 pt-4">
        <ol className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                      i < step
                        ? "bg-success text-success-foreground"
                        : i === step
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-2 text-muted-foreground",
                    )}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden truncate text-xs font-semibold sm:block",
                      i === step ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-surface-2">
                  <div
                    className={cn("h-full rounded-full transition-all", i <= step ? "bg-primary" : "bg-transparent")}
                    style={{ width: i <= step ? "100%" : "0%" }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {step === 0 && (
            <section className="space-y-3 animate-rise">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <MapPin className="h-4 w-4 text-primary" /> Endereço de entrega
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="CEP" className="col-span-2 sm:col-span-1">
                  <div className="relative">
                    <input
                      value={address.cep}
                      inputMode="numeric"
                      maxLength={9}
                      onChange={(e) => void lookupCep(e.target.value)}
                      placeholder="01310-100"
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                    {cepStatus === "loading" && (
                      <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  {cepStatus === "error" && <p className="mt-1 text-xs text-live">CEP não encontrado.</p>}
                  {cepStatus === "ok" && <p className="mt-1 text-xs text-success">Endereço preenchido automaticamente.</p>}
                </Field>
                <Field label="Rua" className="col-span-2">
                  <Input value={address.rua} onChange={(v) => setAddress({ ...address, rua: v })} placeholder="Av. Paulista" />
                </Field>
                <Field label="Número">
                  <Input value={address.numero} onChange={(v) => setAddress({ ...address, numero: v })} placeholder="240" />
                </Field>
                <Field label="Complemento">
                  <Input
                    value={address.complemento}
                    onChange={(v) => setAddress({ ...address, complemento: v })}
                    placeholder="Apto 52"
                  />
                </Field>
                <Field label="Bairro" className="col-span-2 sm:col-span-1">
                  <Input value={address.bairro} onChange={(v) => setAddress({ ...address, bairro: v })} placeholder="Bela Vista" />
                </Field>
                <Field label="Cidade">
                  <Input value={address.cidade} onChange={(v) => setAddress({ ...address, cidade: v })} placeholder="São Paulo" />
                </Field>
                <Field label="UF">
                  <Input value={address.uf} onChange={(v) => setAddress({ ...address, uf: v.toUpperCase().slice(0, 2) })} placeholder="SP" />
                </Field>
              </div>
              {!cepFilled && (
                <p className="text-xs text-muted-foreground">Informe o CEP para continuar e calcular o frete.</p>
              )}
            </section>
          )}

          {step === 1 && (
            <section className="space-y-3 animate-rise">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <Truck className="h-4 w-4 text-primary" /> Opções de frete para {address.cep}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {SHIPPING_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setShippingId(o.id)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all",
                      shippingId === o.id
                        ? "border-primary bg-accent ring-1 ring-primary"
                        : "border-border bg-card hover:bg-surface",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{o.label}</span>
                      <span className="text-sm font-extrabold text-primary">{brl(o.price)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Entrega em {o.eta}</p>
                  </button>
                ))}
              </div>
              {!shippingOption && <p className="text-xs text-muted-foreground">Selecione uma opção de frete para continuar.</p>}
            </section>
          )}

          {step === 2 && (
            <section className="space-y-3 animate-rise">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <CreditCard className="h-4 w-4 text-primary" /> Pagamento
              </h2>
              <div className="space-y-2">
                {[
                  { id: "pix", label: "Pix (simulado)", icon: QrCode },
                  { id: "cartao", label: "Cartão •••• 4218 (simulado)", icon: CreditCard },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPayment(id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-2xl p-3 text-sm",
                      payment === id ? "bg-accent ring-1 ring-primary" : "bg-surface",
                    )}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-3 animate-rise">
              <h2 className="text-sm font-bold">Revisão do pedido</h2>
              <div className="space-y-3 rounded-2xl soft-card p-4 text-sm">
                <Review label="Entrega">
                  {address.rua}, {address.numero}
                  {address.complemento && ` — ${address.complemento}`}
                  <br />
                  {address.bairro} · {address.cidade}/{address.uf} · {address.cep}
                </Review>
                <Review label="Frete">
                  {shippingOption?.label} — {shippingOption?.eta} ({brl(shipping)})
                </Review>
                <Review label="Pagamento">{payment === "pix" ? "Pix (simulado)" : "Cartão •••• 4218 (simulado)"}</Review>
              </div>
              <p className="text-center text-[11px] text-muted-foreground">
                Protótipo: nenhum pagamento real é processado.
              </p>
            </section>
          )}

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="rounded-full bg-surface px-5 py-3 text-sm font-semibold"
              >
                Voltar
              </button>
            )}
            <button
              disabled={!canAdvance}
              onClick={() => (step === 3 ? finish() : setStep((s) => s + 1))}
              className={cn(
                "flex-1 rounded-full py-3 text-sm font-bold transition-transform active:scale-[0.99]",
                canAdvance
                  ? "bg-primary text-primary-foreground"
                  : "cursor-not-allowed bg-surface-2 text-muted-foreground",
              )}
            >
              {step === 3 ? "Finalizar pedido" : "Continuar"}
            </button>
          </div>
        </div>

        {/* Resumo fixo */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl soft-card p-4">
            <h2 className="text-sm font-bold">Resumo do pedido</h2>
            <div className="mt-3 space-y-2">
              {cart.map((l) => {
                const p = getProduct(l.productId)!;
                return (
                  <div key={`${l.productId}-${l.variant}`} className="flex items-center gap-2">
                    <img src={p.images[0]} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1 line-clamp-2 text-xs">
                      {l.qty}× {p.name}
                    </span>
                    <span className="shrink-0 text-xs font-semibold">{brl(p.price * l.qty)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{brl(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete{shippingOption ? ` (${shippingOption.label})` : ""}</span>
                <span>{shippingOption ? brl(shipping) : "a calcular"}</span>
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
              <span className="text-sm font-bold">Total</span>
              <span className="text-2xl font-black tracking-tight text-primary tabular-nums">{brl(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
    />
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Review({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{children}</p>
    </div>
  );
}
