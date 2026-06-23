"use client";
import { Sparkles, ArrowRight, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { CommerceTheme } from "../utils/Commercetheme";

type Props = {
  onNavigate: () => void;
  isLoggedIn: boolean;
  theme: CommerceTheme;
  businessName?: string | null;
};

const previewMessages: Record<string, { greeting: string; body: string; signature: string }> = {
  PETSHOP: {
    greeting: "Olá João! 🐾",
    body: "O Thor está há 12 dias sem banho. Que tal agendarmos um banho e tosa para deixá-lo sempre limpinho e cheiroso? 🐶✨",
    signature: "Equipe do Petshop",
  },
  AUTOMOTIVE: {
    greeting: "Olá Carlos! 🚗",
    body: "Seu veículo está há 30 dias sem higienização. Que tal agendar uma limpeza completa e deixar seu carro impecável? ✨",
    signature: "Equipe de Estética Automotiva",
  },
  FEMININE_AESTHETIC: {
    greeting: "Olá Linda! 💅",
    body: "Seu horário de alongamento de cílios está confirmado para amanhã às 14h. Cuide-se, você merece se sentir ainda mais incrível! ✨",
    signature: "Equipe de Estética",
  },
};

export function IAHighlight({ onNavigate, isLoggedIn, theme, businessName }: Props) {
  // Detecta o commerce pelo primaryHex
  const commerce =
    theme.primaryHex === "#fbbf24"
      ? "PETSHOP"
      : theme.primaryHex === "#60a5fa"
        ? "AUTOMOTIVE"
        : "FEMININE_AESTHETIC";

  const preview = previewMessages[commerce];

  function handleBtnIA() {
    if (!isLoggedIn) {
      toast.error("Você não tem acesso a esse recurso");
      return;
    }
    onNavigate();
  }

  return (
    <section
      className="w-full rounded-2xl p-6 lg:p-8"
      style={{
        border: `1px solid ${theme.primaryHex}25`,
        background: "linear-gradient(135deg, #0D1117 0%, #0A0E14 100%)",
      }}
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Lado esquerdo */}
        <div className="flex-1 flex flex-col gap-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `${theme.primaryHex}15`, border: `1px solid ${theme.primaryHex}30` }}
          >
            <Sparkles size={20} style={{ color: theme.primaryHex }} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: theme.primaryHex }}>
              Inteligência Artificial
            </p>
            <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
              Gerar mensagem automática
              <br />
              por meio de{" "}
              <span className="italic" style={{ color: theme.primaryHex }}>
                IA
              </span>
            </h2>
            <p className="text-zinc-400 text-sm mt-3 max-w-sm leading-relaxed">
              Economize tempo enviando mensagens personalizadas automaticamente para seus clientes inativos.
            </p>
          </div>

          <button
            onClick={handleBtnIA}
            className="relative flex items-center gap-3 px-6 py-3.5 rounded-xl w-full sm:w-auto text-sm font-bold cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
            style={{
              background: theme.primaryHex,
              color: "#000",
              boxShadow: `0 4px 20px ${theme.primaryHex}40`,
            }}
          >
            <Sparkles size={16} />
            Gerar mensagem com IA
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Preview */}
        <div
          className="flex-1 w-full rounded-2xl p-5"
          style={{
            border: `1px solid ${theme.primaryHex}15`,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <p
            className="text-sm font-semibold flex items-center gap-2 mb-4"
            style={{ color: theme.primaryHex }}
          >
            <Eye size={13} /> Preview da mensagem
          </p>

          <div className="bg-[#0D1117] rounded-xl p-4 text-sm text-zinc-300 leading-relaxed border border-white/5">
            <p className="font-semibold text-white">{preview.greeting}</p>
            <p className="mt-2 text-zinc-400">{preview.body}</p>
            <p className="mt-3 text-zinc-400">Estamos à disposição!</p>
            <p className="mt-3 font-medium text-white">
              — {businessName ?? preview.signature}
            </p>
            <div
              className="text-xs text-right mt-3"
              style={{ color: `${theme.primaryHex}60` }}
            >
              10:30 ✓✓
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
