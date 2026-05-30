"use client";

import { useRouter } from "next/navigation";

export default function Aguardando() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] rounded-full bg-amber-500/3 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
            <span className="text-5xl">🎉</span>
          </div>

          <div className="absolute inset-0 rounded-full border border-amber-500/20 scale-110 animate-ping" />
          <div className="absolute inset-0 rounded-full border border-amber-500/10 scale-125" />
        </div>

        <div className="mt-20 w-full bg-[#1A1D22]/90 backdrop-blur-lg rounded-3xl border border-amber-500/30 shadow-2xl px-8 py-10 flex flex-col items-center gap-5">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-amber-400 leading-snug">Cadastro recebido!</h1>
            <p className="text-zinc-300 text-base leading-relaxed">
              Entraremos em contato em até <span className="text-amber-400 font-semibold">24h</span>{" "}
              para confirmar o pagamento e liberar seu acesso.
            </p>
          </div>

          <div className="w-full h-px bg-amber-500/15" />

          <div className="w-full flex flex-col gap-3">
            {[
              { label: "Cadastro enviado", done: true },
              { label: "Confirmação de pagamento", done: false },
              { label: "Acesso liberado", done: false },
            ].map(({ label, done }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                    done
                      ? "bg-amber-500 border-amber-500 text-black"
                      : "border-zinc-600 text-zinc-500"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  className={`text-sm ${done ? "text-amber-300 font-medium" : "text-zinc-500"}`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Divisor */}
          <div className="w-full h-px bg-amber-500/15" />

          {/* WhatsApp hint */}
          <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 w-full">
            <span className="text-xl flex-shrink-0">📱</span>
            <p className="text-xs text-zinc-400 leading-relaxed text-left">
              Fique de olho no WhatsApp cadastrado. Nossa equipe entrará em contato por lá para
              confirmar os próximos passos.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm font-semibold hover:bg-amber-500 hover:text-black transition-all duration-200 cursor-pointer"
          >
            Voltar para o início
          </button>
        </div>

        <p className="text-xs text-zinc-600">© 2025 New-Pettz. Todos os direitos reservados.</p>
      </div>
    </main>
  );
}
