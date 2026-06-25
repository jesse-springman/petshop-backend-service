"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CommerceTheme, commerceThemes } from "@/utils/Commercetheme";
import { Commerce } from "@/types/commerce";
import { createTransacao } from "@/services/financeiro/post";
import toast from "react-hot-toast";

const CATEGORIAS = ["Produtos", "Aluguel", "Energia", "Água", "Marketing", "Outros"] as const;

type Categoria = (typeof CATEGORIAS)[number];

interface NovaDespesaPageProps {
  commerce: Commerce;
}

export function NewExpensePage({ commerce }: NovaDespesaPageProps) {
  const router = useRouter();
  const theme: CommerceTheme = commerceThemes[commerce];

  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "">("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function formatarValor(raw: string) {
    const numeros = raw.replace(/\D/g, "");
    if (!numeros) return "";
    const num = (parseInt(numeros, 10) / 100).toFixed(2);
    return num.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setValor(formatarValor(raw));
  }

  function valorNumerico(): number {
    return parseFloat(valor.replace(/\./g, "").replace(",", ".")) || 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!valor || valorNumerico() <= 0) {
      setErro("Informe um valor válido.");
      return;
    }
    if (!categoria) {
      setErro("Selecione uma categoria.");
      return;
    }

    setLoading(true);
    try {
      await createTransacao({
        type: "EXPENSE",
        amount: valorNumerico(),
        category: categoria,
        description: descricao.trim() || undefined,
      });

      toast.success("Nova Despesa criada");
      router.push("/financeiro");
    } catch (err) {
      setErro("Erro ao registrar despesa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm mb-6"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>

          <p
            className="text-xs font-medium uppercase tracking-widest mb-1"
            style={{ color: theme.primaryHex }}
          >
            Financeiro
          </p>
          <h1 className="text-2xl font-semibold text-zinc-100">Nova despesa</h1>
          <p className="text-sm text-zinc-400 mt-1">Registre uma saída no fluxo de caixa.</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6"
        >
          {/* Valor */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">
                R$
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={valor}
                onChange={handleValorChange}
                placeholder="0,00"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-zinc-100 text-lg font-medium placeholder-zinc-600 focus:outline-none transition-colors"
                style={{
                  borderColor: valor ? theme.primaryHex + "66" : undefined,
                }}
                onFocus={(e) => (e.target.style.borderColor = theme.primaryHex)}
                onBlur={(e) =>
                  (e.target.style.borderColor = valor ? theme.primaryHex + "66" : "#3f3f46")
                }
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIAS.map((cat) => {
                const ativo = categoria === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoria(cat)}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium border transition-all text-left"
                    style={{
                      background: ativo ? theme.primaryHex + "18" : "transparent",
                      borderColor: ativo ? theme.primaryHex : "#3f3f46",
                      color: ativo ? theme.primaryHex : "#a1a1aa",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-2">
              Descrição{" "}
              <span className="normal-case text-zinc-600 lowercase tracking-normal">
                (opcional)
              </span>
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Compra de shampoo para estoque"
              rows={3}
              maxLength={200}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none resize-none transition-colors"
              onFocus={(e) => (e.target.style.borderColor = theme.primaryHex)}
              onBlur={(e) => (e.target.style.borderColor = "#3f3f46")}
            />
          </div>

          {/* Erro */}
          {erro && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {erro}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
            style={{
              background: theme.primaryHex,
              color: commerce === "PETSHOP" ? "#000" : "#fff",
            }}
          >
            {loading ? "Registrando..." : "Registrar despesa"}
          </button>
        </form>
      </div>
    </div>
  );
}
