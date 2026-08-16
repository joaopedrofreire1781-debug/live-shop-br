export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const compact = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1).replace(".", ",")} mil` : String(value);
