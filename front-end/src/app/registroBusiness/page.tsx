"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plan } from "@/types/plan";
import { Commerce } from "@/types/commerce";
import { registerBusiness } from "../../services/businessRegister";
import { BusinessDto } from "@/types/businessDto";

const commerceDetails: Record<Commerce, { label: string; icon: string; description: string }> = {
  PETSHOP: {
    label: "Petshop",
    icon: "🐾",
    description: "Banho, tosa e cuidados com pets",
  },
  AUTOMOTIVE: {
    label: "Estética Automotiva",
    icon: "🚗",
    description: "Higienização e polimento de veículos",
  },
  FEMININE_AESTHETIC: {
    label: "Estética Feminina",
    icon: "💅",
    description: "Cílios, unhas e sobrancelhas",
  },
};

const planDetails = {
  [Plan.BASIC]: {
    label: "Basic",
    price: "R$ 50/mês",
    description: "Ideal para começar",
    perks: ["Até 30 clientes", "Agenda básica"],
    icon: "🌱",
  },
  [Plan.GOLD]: {
    label: "Gold",
    price: "R$ 70/mês",
    description: "Para negócios em crescimento",
    perks: ["Mensagens enviadas por IA", "Clientes ilimitados", "Agenda completa", "Relatórios"],
    icon: "⭐",
  },
};

function maskWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function RegisterBusiness() {
  const router = useRouter();

  const [business, setBusiness] = useState<BusinessDto>({
    businessName: "",
    adiminName: "",
    password: "",
    plan: Plan.BASIC,
    commerce: "PETSHOP",
    whatsapp: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleChange = (field: keyof BusinessDto, value: string) => {
    setBusiness((prev) => ({ ...prev, [field]: value }));
  };

  const handleWhatsapp = (value: string) => {
    handleChange("whatsapp", maskWhatsapp(value));
  };

  const rawWhatsapp = business.whatsapp.replace(/\D/g, "");

  const step1Valid =
    business.businessName.trim().length > 0 &&
    business.adiminName.trim().length > 0 &&
    rawWhatsapp.length === 11 &&
    business.commerce !== null;

  const step2Valid = business.password.length >= 6 && business.password === confirmPassword;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (step1Valid) setStep(2);
      return;
    }

    if (!step2Valid) return;
    setLoading(true);
    try {
      await registerBusiness({ ...business, whatsapp: rawWhatsapp });
      toast.success("Negócio registrado com sucesso!");
      router.push("/aguardando");
    } catch {
      toast.error("Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <button
        onClick={() => router.push("/")}
        className="absolute top-5 left-5 flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors group"
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
        Voltar
      </button>

      <div className="text-center mb-8">
        <span className="text-4xl">{commerceDetails[business.commerce].icon}</span>
        <h1 className="text-3xl font-bold text-amber-400 mt-2 tracking-tight">
          Registro do Negócio
        </h1>
        <p className="text-zinc-400 mt-1 text-sm">Preencha os dados e comece a usar agora mesmo</p>
      </div>

      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                step >= s
                  ? "bg-amber-500 border-amber-500 text-black"
                  : "border-zinc-600 text-zinc-500"
              }`}
            >
              {s}
            </div>
            {s < 2 && (
              <div
                className={`w-16 h-px transition-all duration-500 ${
                  step > s ? "bg-amber-500" : "bg-zinc-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg">
        <form
          onSubmit={
            step === 1
              ? (e) => {
                  e.preventDefault();
                  if (step1Valid) setStep(2);
                }
              : handleFormSubmit
          }
        >
          <div className="bg-[#1A1D22]/90 backdrop-blur-lg rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden">
            <div className={`transition-all duration-500 ${step === 1 ? "block" : "hidden"}`}>
              <div className="px-8 pt-8 pb-6 space-y-5">
                <h2 className="text-lg font-semibold text-white mb-1">Dados do Negócio</h2>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Tipo de Negócio
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(commerceDetails) as Commerce[]).map((c) => {
                      const detail = commerceDetails[c];
                      const selected = business.commerce === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleChange("commerce", c)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            selected
                              ? "border-amber-500 bg-amber-500/10 text-amber-400"
                              : "border-zinc-700 bg-[#0B0E11] text-zinc-400 hover:border-zinc-500"
                          }`}
                        >
                          <span className="text-xl">{detail.icon}</span>
                          <span className="text-xs font-bold text-center">{detail.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {commerceDetails[business.commerce].description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Nome do Negócio
                  </label>
                  <input
                    type="text"
                    value={business.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    placeholder={`Ex: ${commerceDetails[business.commerce].label} da Cris`}
                    required
                    className="w-full px-4 py-3 bg-[#0B0E11] text-white rounded-xl border border-amber-500/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition placeholder-zinc-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Seu Nome (Administrador)
                  </label>
                  <input
                    type="text"
                    value={business.adiminName}
                    onChange={(e) => handleChange("adiminName", e.target.value)}
                    placeholder="Ex: Cris"
                    required
                    className="w-full px-4 py-3 bg-[#0B0E11] text-white rounded-xl border border-amber-500/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition placeholder-zinc-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    WhatsApp
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-sm">
                      📱
                    </span>
                    <input
                      type="tel"
                      value={business.whatsapp}
                      onChange={(e) => handleWhatsapp(e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#0B0E11] text-white rounded-xl border border-amber-500/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition placeholder-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Escolha seu Plano
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.values(Plan) as Plan[]).map((p) => {
                      const detail = planDetails[p];
                      const selected = business.plan === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleChange("plan", p)}
                          className={`mt-4 mb-4 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            selected
                              ? "border-amber-500 bg-amber-500/10 text-amber-400"
                              : "border-zinc-700 bg-[#0B0E11] text-zinc-400 hover:border-zinc-500"
                          }`}
                        >
                          <span className="text-sm">{detail.icon}</span>
                          <span className="text-sm font-bold">{detail.label}</span>
                          <span className="text-[15px] opacity-70">{detail.price}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-sm text-amber-300 font-semibold mb-1">
                      {planDetails[business.plan].description}
                    </p>
                    <ul className="space-y-0.5">
                      {planDetails[business.plan].perks.map((perk) => (
                        <li key={perk} className="text-sm text-zinc-400 flex items-center gap-2">
                          <span className="text-amber-500">✓</span> {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8">
                <button
                  type="submit"
                  disabled={!step1Valid}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Continuar →
                </button>
              </div>
            </div>

            {/* STEP 2 */}
            <div className={`transition-all duration-500 ${step === 2 ? "block" : "hidden"}`}>
              <div className="px-8 pt-8 pb-6 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Crie sua senha</h2>
                  <p className="text-sm text-zinc-500">Mínimo de 6 caracteres</p>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0B0E11] border border-zinc-800">
                  <span className="text-2xl">{commerceDetails[business.commerce].icon}</span>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {business.businessName || "—"}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {business.adiminName} · {planDetails[business.plan].label} ·{" "}
                      {commerceDetails[business.commerce].label}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="ml-auto text-xs text-amber-500 hover:text-amber-300 transition cursor-pointer"
                  >
                    Editar
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={business.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      className="w-full px-4 py-3 pr-12 bg-[#0B0E11] text-white rounded-xl border border-amber-500/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition placeholder-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition cursor-pointer"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>

                  {business.password.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3].map((level) => {
                        const strength =
                          business.password.length < 6 ? 1 : business.password.length < 10 ? 2 : 3;
                        return (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= strength
                                ? strength === 1
                                  ? "bg-red-500"
                                  : strength === 2
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                : "bg-zinc-700"
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Confirmar Senha
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className={`w-full px-4 py-3 bg-[#0B0E11] text-white rounded-xl border focus:outline-none focus:ring-1 transition placeholder-zinc-600 ${
                      confirmPassword.length > 0 && confirmPassword !== business.password
                        ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                        : "border-amber-500/30 focus:border-amber-400 focus:ring-amber-400/30"
                    }`}
                  />
                  {confirmPassword.length > 0 && confirmPassword !== business.password && (
                    <p className="text-xs text-red-400">As senhas não coincidem</p>
                  )}
                </div>
              </div>

              <div className="px-8 pb-8 space-y-3">
                <button
                  type="submit"
                  disabled={!step2Valid || loading}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    `Registrar ${commerceDetails[business.commerce].label} 🚀`
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 text-sm text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                >
                  ← Voltar
                </button>
              </div>
            </div>
          </div>
        </form>

        <p className="text-center text-xs text-zinc-600 mt-6">
          © 2025 New-Pettz. Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
}
