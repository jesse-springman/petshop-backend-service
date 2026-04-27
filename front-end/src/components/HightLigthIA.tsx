"use client";
import { Sparkles, ArrowRight, Eye } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  onNavigate: () => void;
  isLoggedIn: boolean;
};

export function IAHighlight({ onNavigate, isLoggedIn }: Props) {
  function handleBtnIA() {
    if (!isLoggedIn) {
      toast.error("Você não tem acesso a esse recurso");
      return;
    }

    onNavigate();
  }

  return (
    <section className="w-full border border-amber-500/30 rounded-2xl p-5 bg-gradient-to-br from-zinc-900 to-black">
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 flex flex-col gap-6">
          <div className="w-16 h-16 bg-amber-500/15 border border-amber-500/30 rounded-full flex items-center justify-center">
            <Sparkles className="text-amber-400 w-7 h-7" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text--400 leading-tight">
              Gerar mensagem automática
              <br />
              por meio de <span className="italic text-amber-400">IA</span>
            </h2>
            <p className="text-gray-400 text-lg mt-3 max-w-sm leading-relaxed">
              Economize tempo enviando mensagens personalizadas automaticamente para seus clientes.
            </p>
          </div>

          <button
            onClick={handleBtnIA}
            className="relative flex items-center gap-3 px-6 py-4 rounded-xl w-full sm:w-auto text-base font-bold cursor-pointer
             bg-gradient-to-br from-amber-400 to-amber-600 text-black
             shadow-[0_4px_20px_rgba(245,158,11,0.3)]
             hover:text-amber-400 hover:shadow-[0_4px_20px_rgba(245,158,11,0.15)]
             hover:ring-1 hover:ring-amber-500/60
             transition-all duration-300
             before:absolute before:inset-0 before:rounded-xl before:bg-black
             before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Sparkles size={18} />
              Gerar mensagem com IA
              <ArrowRight size={18} />
            </span>
          </button>
        </div>

        <div className="flex-1 w-full border border-amber-500/20 rounded-xl p-5 bg-zinc-900/60">
          <p className="text-amber-400 text-lg font-semibold flex items-center gap-2 mb-4">
            <Eye size={14} /> Preview da mensagem
          </p>

          <div className="bg-zinc-800 rounded-xl p-5 text-sm text-gray-200 leading-relaxed">
            <p>Olá João! O Thor está há 12 dias sem banho.</p>
            <p className="mt-2">
              Que tal agendarmos um banho e tosa para deixá-lo sempre limpinho e cheiroso? 🐶✨
            </p>
            <p className="mt-3">Estamos à disposição!</p>
            <p className="mt-4 font-medium">Equipe New-Pettz 🐾</p>
            <div className="text-xs text-gray-500 text-right mt-3">10:30 ✓✓</div>
          </div>
        </div>
      </div>
    </section>
  );
}
