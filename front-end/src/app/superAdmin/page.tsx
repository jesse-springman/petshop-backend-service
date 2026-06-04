"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { getBusiness } from "../../services/superAdmin/get";
import { patchBusiness } from "@/services/superAdmin/patch";
import { Business } from "@/types/business";
import { BusinessStatus } from "@/types/statusBusiness";
import toast from "react-hot-toast";

const statusConfig: Record<BusinessStatus, { label: string; color: string }> = {
  PENDING: { label: "Pendente", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  ACTIVE: { label: "Ativo", color: "text-green-400 bg-green-500/10 border-green-500/30" },
  SUSPENDED: { label: "Suspenso", color: "text-red-400 bg-red-500/10 border-red-500/30" },
  CANCELED: { label: "Cancelado", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30" },
};

const planLabel: Record<string, string> = {
  BASIC: "🌱 Basic",
  GOLD: "⭐ Gold",
};

export default function SuperAdminPage() {
  const { isSuperAdmin, loading } = useUser();
  const router = useRouter();
  const [business, setBusiness] = useState<Business[]>([]);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isSuperAdmin) {
      router.replace("/");
    }
  }, [loading, isSuperAdmin, router]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    getBusiness()
      .then(setBusiness)
      .catch(() => toast.error("Erro ao carregar business"))
      .finally(() => setFetching(false));
  }, [isSuperAdmin]);

  async function handleStatus(id: string, status: BusinessStatus) {
    setUpdating(id);
    try {
      const updated = await patchBusiness(id, status);
      setBusiness((prev) => prev.map((p) => (p.id === id ? { ...p, status: updated.status } : p)));
      toast.success("Status atualizado!");
    } catch {
      toast.error("Erro ao atualizar status");
    } finally {
      setUpdating(null);
    }
  }

  if (loading || fetching) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </main>
    );
  }

  const counts = {
    total: business.length,
    pending: business.filter((p) => p.status === "PENDING").length,
    active: business.filter((p) => p.status === "ACTIVE").length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] px-4 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Painel Admin</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Gerencie os business cadastrados</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-zinc-400 hover:text-amber-400 transition"
          >
            ← Voltar
          </button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: counts.total, color: "text-white" },
            { label: "Pendentes", value: counts.pending, color: "text-amber-400" },
            { label: "Ativos", value: counts.active, color: "text-green-400" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-[#1A1D22]/90 border border-amber-500/20 rounded-2xl px-5 py-4 flex flex-col gap-1"
            >
              <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
              <span className={`text-2xl font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-3">
          {business.length === 0 && (
            <div className="text-center text-zinc-500 py-16">Nenhum petshop cadastrado ainda.</div>
          )}

          {business.map((p) => {
            const cfg = statusConfig[p.status];
            const isUpdating = updating === p.id;

            return (
              <div
                key={p.id}
                className="bg-[#1A1D22]/90 border border-amber-500/20 rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Info */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{p.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span>{planLabel[p.plan] ?? p.plan}</span>
                    <span>·</span>
                    <span>Admin: {p.users[0]?.name ?? "—"}</span>
                    <span>·</span>
                    <span>📱 {p.whatsapp ?? "—"}</span>
                    <span>·</span>
                    <span>{new Date(p.createdAt).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 flex-wrap">
                  {p.status !== "ACTIVE" && (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatus(p.id, "ACTIVE")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black transition disabled:opacity-50 cursor-pointer"
                    >
                      Ativar
                    </button>
                  )}
                  {p.status !== "SUSPENDED" && (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatus(p.id, "SUSPENDED")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-black transition disabled:opacity-50 cursor-pointer"
                    >
                      Suspender
                    </button>
                  )}
                  {p.status !== "CANCELED" && (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatus(p.id, "CANCELED")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-500/10 border border-zinc-500/30 text-zinc-400 hover:bg-zinc-500 hover:text-black transition disabled:opacity-50 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                  {isUpdating && (
                    <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin self-center" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
