"use client";

import { useEffect, useState, useRef } from "react";
import { getClients } from "@/services/customer/get";
import { Client, Pet } from "@/types/clients";
import { postGenerateMessageAI } from "@/services/aiGenerate/post";
import { useUser } from "@/context/UserContext";
import { Commerce } from "@/types/commerce";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { commerceThemes } from "@/utils/Commercetheme";

type MessageType =
  | "LEMBRETE_BANHO"
  | "AGENDAMENTO"
  | "COBRANCA"
  | "LEMBRETE_REVISAO"
  | "VEICULO_PRONTO"
  | "LEMBRETE_PROCEDIMENTO"
  | "RETORNO";

const typeConfigByCommerce: Record<Commerce, { value: MessageType; label: string }[]> = {
  PETSHOP: [
    { value: "LEMBRETE_BANHO", label: "🛁 Lembrete de Banho" },
    { value: "AGENDAMENTO", label: "📅 Lembrete de Agendamento" },
    { value: "COBRANCA", label: "💰 Cobrança" },
  ],
  AUTOMOTIVE: [
    { value: "LEMBRETE_REVISAO", label: "🔧 Lembrete de Revisão" },
    { value: "VEICULO_PRONTO", label: "🚗 Veículo Pronto" },
    { value: "AGENDAMENTO", label: "📅 Lembrete de Agendamento" },
    { value: "COBRANCA", label: "💰 Cobrança" },
  ],
  FEMININE_AESTHETIC: [
    { value: "LEMBRETE_PROCEDIMENTO", label: "💅 Lembrete de Procedimento" },
    { value: "RETORNO", label: "🔁 Convite de Retorno" },
    { value: "AGENDAMENTO", label: "📅 Lembrete de Agendamento" },
    { value: "COBRANCA", label: "💰 Cobrança" },
  ],
};

const BREED_EMOJI: Record<string, string> = {
  labrador: "🦮",
  poodle: "🐩",
  bulldog: "🐶",
  default: "🐾",
};

function getPetEmoji(breed?: string | null): string {
  const key = breed?.toLowerCase() ?? "";
  return Object.entries(BREED_EMOJI).find(([k]) => key.includes(k))?.[1] ?? BREED_EMOJI.default;
}

export default function RespostaIAPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [type, setType] = useState<MessageType>("LEMBRETE_BANHO");
  const [message, setMessage] = useState<string | null>(null);
  const [displayed, setDisplayed] = useState("");
  const [erro, setErro] = useState(false);
  const [withoutMessageAI, setWithoutMessageAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { commerce } = useUser();

  const currentCommerce = (commerce as Commerce) ?? "PETSHOP";
  const typeOptions = typeConfigByCommerce[currentCommerce];

  const theme = commerceThemes[(commerce ?? "PETSHOP") as Commerce];

  useEffect(() => {
    const getAllCustomers = async () => {
      try {
        const response = await getClients();
        setClients(response);
      } catch {
        setErro(true);
      } finally {
        setLoadingClients(false);
      }
    };
    getAllCustomers();
  }, []);

  // reseta o type quando troca de commerce
  useEffect(() => {
    setType(typeOptions[0].value);
  }, [commerce]);

  // efeito de digitação
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
      if (i >= message.length) clearInterval(intervalRef.current!);
    }, 18);
    return () => clearInterval(intervalRef.current!);
  }, [message]);

  const filtered = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.pets?.some((p) => p.name?.toLowerCase().includes(search.toLowerCase())),
  );

  async function handleGenerate() {
    if (!selectedClient) return;
    setLoading(true);
    setMessage(null);
    setWithoutMessageAI(false);

    try {
      const response = await postGenerateMessageAI({
        customerId: selectedClient.id,
        type,
        commerce: currentCommerce,
        petId: selectedPet?.id,
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
    if (!message || !selectedClient) return;
    const cleaned = selectedClient.phone?.replace(/\D/g, "");
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
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: theme.primaryHex }}>
            Geração Inteligente de Mensagens
          </h1>
          <p className="text-zinc-500 text-[16px] tracking-widest uppercase">
            Comunicação automatizada para seu negócio
          </p>
        </div>

        {erro && (
          <p className="text-red-400 text-sm text-center py-4">
            Não foi possível localizar os clientes.
          </p>
        )}

        {/* STEP 1 — Selecionar cliente */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-zinc-400 uppercase tracking-widest">
              1. Selecione o cliente
            </h2>
            {selectedClient && (
              <button
                onClick={() => {
                  setSelectedClient(null);
                  setSelectedPet(null);
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
            placeholder={
              currentCommerce === "PETSHOP"
                ? "Buscar por cliente ou pet..."
                : "Buscar por cliente..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all"
            onFocus={(e) => (e.currentTarget.style.borderColor = `${theme.primaryHex}60`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)")}
          />

          {loadingClients ? (
            <p className="text-zinc-600 text-xl text-center py-4">Carregando clientes...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedClient(c);
                    setSelectedPet(null);
                    setMessage(null);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                    selectedClient?.id === c.id
                      ? "shadow-lg"
                      : "border-zinc-800 bg-zinc-800/40 hover:border-zinc-600 hover:bg-zinc-800/70"
                  }`}
                  style={
                    selectedClient?.id === c.id
                      ? {
                          borderColor: `${theme.primaryHex}60`,
                          background: `${theme.primaryHex}10`,
                          boxShadow: `0 0 12px ${theme.primaryHex}15`,
                        }
                      : {}
                  }
                >
                  <span className="text-2xl">
                    {currentCommerce === "PETSHOP"
                      ? getPetEmoji(c.pets?.[0]?.breed)
                      : currentCommerce === "AUTOMOTIVE"
                        ? "🚗"
                        : "💅"}
                  </span>
                  <span className="text-xl font-bold text-zinc-200 truncate w-full">{c.name}</span>
                  {currentCommerce === "PETSHOP" && c.pets?.[0] && (
                    <span className="text-[15px] text-zinc-500 truncate w-full">
                      {c.pets[0].name}
                    </span>
                  )}
                  {selectedClient?.id === c.id && (
                    <span className="text-[14px] font-semibold" style={{ color: theme.primaryHex }}>
                      ✓ selecionado
                    </span>
                  )}
                </button>
              ))}

              {filtered.length === 0 && (
                <p className="col-span-full text-zinc-600 text-sm text-center py-6">
                  Nenhum cliente encontrado
                </p>
              )}
            </div>
          )}
        </div>

        {currentCommerce === "PETSHOP" &&
          selectedClient &&
          (selectedClient.pets?.length ?? 0) > 1 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-6 flex flex-col gap-4">
              <h2 className="text-[16px] font-semibold text-zinc-400 uppercase tracking-widest">
                1.5. Selecione o pet
              </h2>
              <div className="flex gap-2 flex-wrap">
                {selectedClient.pets.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => setSelectedPet(pet)}
                    style={
                      selectedPet?.id === pet.id
                        ? {
                            borderColor: theme.primaryHex,
                            background: `${theme.primaryHex}10`,
                            color: theme.primaryHex,
                          }
                        : {}
                    }
                  >
                    {getPetEmoji(pet.breed)} {pet.name}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* STEP 2 — Gerar mensagem */}
        <div
          className={`rounded-2xl border bg-zinc-900/80 backdrop-blur-sm p-6 flex flex-col gap-4 transition-all duration-300 ${
            selectedClient
              ? "border-zinc-700/60 opacity-100"
              : "border-zinc-800/40 opacity-40 pointer-events-none"
          }`}
        >
          <h2 className="text-[16px] font-semibold text-zinc-400 uppercase tracking-widest">
            2. Gerar mensagem personalizada
            {selectedClient && (
              <span
                className="ml-2 text-xl normal-case font-normal"
                style={{ color: theme.primaryHex }}
              >
                — {selectedClient.name}
              </span>
            )}
          </h2>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as MessageType);
              setMessage(null);
            }}
            className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-3 text-[17px] text-zinc-200 focus:outline-none transition-all appearance-none cursor-pointer duration-200"
            onFocus={(e) => (e.currentTarget.style.borderColor = `${theme.primaryHex}60`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)")}
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedClient}
            className="w-full py-3 rounded-xl font-semibold tracking-wide text-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{
              border: `1px solid ${theme.primaryHex}40`,
              background: `${theme.primaryHex}08`,
              color: theme.primaryHex,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.primaryHex;
              e.currentTarget.style.color = "#000";
              e.currentTarget.style.borderColor = theme.primaryHex;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${theme.primaryHex}08`;
              e.currentTarget.style.color = theme.primaryHex;
              e.currentTarget.style.borderColor = `${theme.primaryHex}40`;
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: `${theme.primaryHex} transparent transparent transparent` }}
                />
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
                    <span
                      className="inline-block w-0.5 h-4 animate-pulse ml-0.5 align-middle"
                      style={{ background: theme.primaryHex }}
                    />
                    <span
                      className="inline-block w-0.5 h-4 animate-pulse ml-0.5 align-middle  delay-150"
                      style={{ background: theme.primaryHex }}
                    />
                    <span
                      className="inline-block w-0.5 h-4 animate-pulse ml-0.5 align-middle delay-300"
                      style={{ background: theme.primaryHex }}
                    />
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
