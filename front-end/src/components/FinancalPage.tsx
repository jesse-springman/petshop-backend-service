"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CommerceTheme, commerceThemes } from "@/utils/Commercetheme";
import { Commerce } from "@/types/commerce";
import { Transaction, TransactionType } from "@/types/typeTransaction";
import { financialSummary } from "@/types/financial-summary";
import { getTransacoes, calcularResumoDoMes } from "@/services/financeiro/get";

interface FinanceiroPageProps {
  commerce: Commerce;
}

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

const RESUMO_INICIAL: financialSummary = {
  revenue: 0,
  expenses: 0,
  profit: 0,
  totalTransactions: 0,
};

export function FinancialPage({ commerce }: FinanceiroPageProps) {
  const theme: CommerceTheme = commerceThemes[commerce];

  const [transacoes, setTransacoes] = useState<Transaction[]>([]);
  const [resumo, setResumo] = useState<financialSummary>(RESUMO_INICIAL);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"ALL" | TransactionType>("ALL");

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getTransacoes();
        setTransacoes(data.trasaction);
        setResumo(calcularResumoDoMes(data.summary));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const transacoesFiltradas = transacoes.filter((t) =>
    filtro === "ALL" ? true : t.type === filtro,
  );

  const lucroPositivo = resumo.profit >= 0;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 pt-10 pb-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p
              className="text-xs font-medium uppercase tracking-widest mb-1"
              style={{ color: theme.primaryHex }}
            >
              Saúde financeira
            </p>
            <h1 className="text-2xl font-semibold text-zinc-100">Financeiro</h1>
          </div>
          <Link
            href="/despesas/nova"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border transition-all active:scale-[0.98]"
            style={{
              background: theme.primaryHex + "15",
              borderColor: theme.primaryHex + "55",
              color: theme.primaryHex,
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nova despesa
          </Link>
        </div>

        {/* Cards resumo */}
        <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-4">
          <SummaryCard
            label="Receita do mês"
            value={loading ? "—" : formatBRL(resumo.revenue)}
            accent={theme.primaryHex}
            positive
          />
          <SummaryCard
            label="Despesas do mês"
            value={loading ? "—" : formatBRL(resumo.expenses)}
            accent="#f87171"
          />
          <SummaryCard
            label="Lucro do mês"
            value={loading ? "—" : formatBRL(resumo.profit)}
            accent={lucroPositivo ? "#4ade80" : "#f87171"}
            positive={lucroPositivo}
          />
          <SummaryCard
            label="Transações"
            value={loading ? "—" : String(resumo.totalTransactions)}
            accent="#a1a1aa"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-5">
          {(["ALL", "INCOME", "EXPENSE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                background: filtro === f ? theme.primaryHex + "20" : "transparent",
                borderColor: filtro === f ? theme.primaryHex : "#3f3f46",
                color: filtro === f ? theme.primaryHex : "#71717a",
              }}
            >
              {f === "ALL" ? "Todos" : f === "INCOME" ? "Entradas" : "Saídas"}
            </button>
          ))}
        </div>

        {/* Lista de transações */}
        {loading ? (
          <ListSkeleton />
        ) : transacoesFiltradas.length === 0 ? (
          <EmptyState filtro={filtro} theme={theme} />
        ) : (
          <div className="flex flex-col gap-2">
            {transacoesFiltradas.map((t) => (
              <TransacaoItem key={t.id} transacao={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-componentes ─── */

function SummaryCard({
  label,
  value,
  accent,
  positive,
}: {
  label: string;
  value: string;
  accent: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <p className="text-xs text-zinc-400 mb-2 leading-tight">{label}</p>
      <p
        className="text-base font-semibold leading-tight"
        style={{ color: positive !== undefined ? accent : "#e4e4e7" }}
      >
        {value}
      </p>
    </div>
  );
}

function TransacaoItem({ transacao }: { transacao: Transaction }) {
  const isIncome = transacao.type === "INCOME";
  return (
    <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5">
      {/* Ícone */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: isIncome ? "#4ade8015" : "#f8717115" }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke={isIncome ? "#4ade80" : "#f87171"}
          strokeWidth={2}
        >
          {isIncome ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8l8-8 8 8" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4m8 8l-8 8-8-8" />
          )}
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-100 font-medium truncate">
          {transacao.description || transacao.category || (isIncome ? "Atendimento" : "Despesa")}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {transacao.category && (
            <span className="text-xs text-zinc-500">{transacao.category}</span>
          )}
          {transacao.category && <span className="text-zinc-700 text-xs">·</span>}
          <span className="text-xs text-zinc-500">{formatData(transacao.createdAt)}</span>
        </div>
      </div>

      {/* Valor */}
      <p
        className="text-sm font-semibold flex-shrink-0"
        style={{ color: isIncome ? "#4ade80" : "#f87171" }}
      >
        {isIncome ? "+" : "-"} {formatBRL(Number(transacao.amount))}
      </p>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ filtro, theme }: { filtro: "ALL" | TransactionType; theme: CommerceTheme }) {
  const msg =
    filtro === "ALL"
      ? "Nenhuma movimentação registrada ainda."
      : filtro === "INCOME"
        ? "Nenhuma entrada registrada."
        : "Nenhuma despesa registrada.";

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ background: theme.primaryHex + "15" }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke={theme.primaryHex}
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <p className="text-zinc-400 text-sm">{msg}</p>
      {filtro !== "INCOME" && (
        <Link
          href="/despesas/nova"
          className="mt-4 text-sm font-medium underline underline-offset-4"
          style={{ color: theme.primaryHex }}
        >
          Registrar despesa
        </Link>
      )}
    </div>
  );
}
