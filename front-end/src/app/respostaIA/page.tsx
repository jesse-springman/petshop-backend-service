"use client";

import { useEffect, useState, useRef } from "react";
import { getClients } from "@/services/customer/get";
import { Client } from "@/types/clients";
import { postGenerateMessageAI } from "@/services/aiGenerate/post";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type MessageType = "LEMBRETE_BANHO" | "AGENDAMENTO" | "COBRANCA";

const typeConfig = {
  LEMBRETE_BANHO: { label: "🛁 Lembrete de Banho" },
  AGENDAMENTO: { label: "📅 Lembrete de Agendamento" },
  COBRANCA: { label: "💰 Cobrança" },
};

const BREED_EMOJI: Record<string, string> = {
  labrador: "🦮",
  poodle: "🐩",
  bulldog: "🐶",
  default: "🐾",
};

function getPetEmoji(breed: string): string {
  const key = breed?.toLowerCase();
  return Object.entries(BREED_EMOJI).find(([k]) => key?.includes(k))?.[1] ?? BREED_EMOJI.default;
}

export default function RespostaIAPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);
  const [type, setType] = useState<MessageType>("LEMBRETE_BANHO");
  const [message, setMessage] = useState<string | null>(null);
  const [displayed, setDisplayed] = useState("");
  const [erro, setErro] = useState(false);
  const [withoutMessageAI, setWithoutMessageAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getAllCustomers = async () => {
      try {
        const response = await getClients();
        setClients(response);
      } catch (error) {
        setErro(true);
      } finally {
        setLoadingClients(false);
      }
    };

    getAllCustomers();
  }, []);

  // Efeito de digitação
  useEffect(() => {
    if (!message) {
      setDisplayed("");
      return;
    }

    setDisplayed("");
    let i = 0;

    intervalRef.current = setInterval(() => {
      setDisplayed(message.slice(0, i + 1));
      i++;
      if (i >= message.length) {
        clearInterval(intervalRef.current!);
      }
    }, 18);

    return () => clearInterval(intervalRef.current!);
  }, [message]);

  const filtered = clients.filter(
    (c) =>
      c.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.pet_name?.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleGenerate() {
    if (!selected) return;
    setLoading(true);
    setMessage(null);
    setWithoutMessageAI(false);

    try {
      const response = await postGenerateMessageAI({
        customerId: selected.id,
        type,
      });

      setMessage(response);
    } catch {
      setWithoutMessageAI(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!message) return;

    try {
      await navigator.clipboard.writeText(message);
      toast.success("Mensagem copiada!");
    } catch {
      // fallback para Safari e browsers sem suporte
      const textarea = document.createElement("textarea");
      textarea.value = message;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Mensagem copiada!");
    }
  }

  function handleWhatsApp() {
    if (!message || !selected) return;
    const cleaned = selected.number_customer?.replace(/\D/g, "");
    window.open(`https://wa.me/55${cleaned}?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <main className="relative min-h-screen bg-[#080A0C] overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src="/images/ai-tech-bg.svg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#080A0C]/60 via-transparent to-[#080A0C] pointer-events-none" />

      <button
        onClick={() => router.push("/")}
        className="fixed top-5 left-5 z-50 px-4 py-2 rounded-xl text-sm font-semibold border border-zinc-700/60 bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all cursor-pointer"
      >
        ← Voltar
      </button>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <span className="text-4xl">🧠</span>
          <h1 className="text-4xl font-bold text-amber-400 tracking-tight">
            Geração Inteligente de Mensagens
          </h1>
          <p className="text-zinc-500 text-[16px] tracking-widest uppercase">
            Comunicação automatizada para seu petshop
          </p>
        </div>

        {erro && (
          <p className="text-red-400 text-sm text-center py-4">
            Não foi possível localizar os clientes.
          </p>
        )}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-zinc-400 uppercase tracking-widest">
              1. Selecione o cliente
            </h2>
            {selected && (
              <button
                onClick={() => {
                  setSelected(null);
                  setMessage(null);
                }}
                className="text-[16px] text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
              >
                limpar seleção
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Buscar por cliente ou pet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 transition-all"
          />

          {loadingClients ? (
            <p className="text-zinc-600 text-xl text-center py-4">Carregando clientes...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelected(c);
                    setMessage(null);
                  }}
                  className={`
                    flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center
                    transition-all duration-200 cursor-pointer
                    ${
                      selected?.id === c.id
                        ? "border-amber-500/60 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                        : "border-zinc-800 bg-zinc-800/40 hover:border-zinc-600 hover:bg-zinc-800/70"
                    }
                  `}
                >
                  <span className="text-2xl">{getPetEmoji(c.pet_breed)}</span>
                  <span className="text-xl font-bold text-zinc-200 truncate w-full">
                    {c.pet_name}
                  </span>
                  <span className="text-[17px] text-zinc-500 truncate w-full">
                    {c.customer_name}
                  </span>
                  {selected?.id === c.id && (
                    <span className="text-[14px] text-amber-400 font-semibold">✓ selecionado</span>
                  )}
                </button>
              ))}

              {erro === false && filtered.length === 0 && (
                <p className="col-span-full text-zinc-600 text-sm text-center py-6">
                  Nenhum cliente encontrado
                </p>
              )}
            </div>
          )}
        </div>

        <div
          className={`rounded-2xl border bg-zinc-900/80 backdrop-blur-sm p-6 flex flex-col gap-4 transition-all duration-300 ${
            selected
              ? "border-zinc-700/60 opacity-100"
              : "border-zinc-800/40 opacity-40 pointer-events-none"
          }`}
        >
          {/* Linha decorativa */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

          <h2 className="text-[16px] font-semibold text-zinc-400 uppercase tracking-widest">
            2. Gerar mensagem personalizada
            {selected && (
              <span className="ml-2 text-xl text-amber-400 normal-case font-normal">
                — {selected.pet_name} ({selected.customer_name})
              </span>
            )}
          </h2>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as MessageType);
              setMessage(null);
            }}
            className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-3 text-[17px] text-zinc-200 focus:outline-none focus:border-amber-500/60 transition-all appearance-none cursor-pointer hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-200 "
          >
            {(Object.keys(typeConfig) as MessageType[]).map((key) => (
              <option key={key} value={key}>
                {typeConfig[key].label}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading || !selected}
            className="w-full py-3 rounded-xl border border-amber-500/40 bg-amber-500/5 text-amber-300 text-xl font-semibold tracking-wide hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2 ">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin " />
                Gerando com IA...
              </span>
            ) : (
              "🤖 Gerar mensagem"
            )}
          </button>

          {withoutMessageAI && (
            <p className="text-red-400 text-sm text-center">Erro ao gerar mensagem</p>
          )}

          {(displayed || loading) && (
            <div className="flex flex-col gap-3">
              <div className="border-t border-zinc-800" />

              <div className="rounded-xl border border-zinc-700/60 bg-zinc-800/40 p-5 min-h-[80px]">
                {loading ? (
                  <div className="flex items-center gap-2 text-zinc-600 text-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse delay-150" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse delay-300" />
                  </div>
                ) : (
                  <p className="text-2xl text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {displayed}
                    {displayed.length < (message?.length ?? 0) && (
                      <span className="inline-block w-0.5 h-4 bg-amber-400 animate-pulse ml-0.5 align-middle" />
                    )}
                  </p>
                )}
              </div>

              {displayed === message && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-700/60 bg-zinc-800/40 text-zinc-300 text-xl font-semibold hover:border-zinc-500 hover:bg-zinc-700/60 transition-all cursor-pointer"
                  >
                    📋 Copiar
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/5 text-emerald-400 text-xl font-semibold hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all cursor-pointer"
                  >
                    📱 WhatsApp
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
