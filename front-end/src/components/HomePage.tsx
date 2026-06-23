"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "../services/login";
import toast from "react-hot-toast";
import { IAHighlight } from "./HightLigthIA";
import { Commerce } from "@/types/commerce";
import { commerceThemes } from "../utils/Commercetheme";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Users,
  UserPlus,
  Database,
  GitGraphIcon,
} from "lucide-react";

interface HomePageProps {
  commerce: Commerce;
}

const actions = [
  {
    title: "Clientes",
    description: "Cadastre e acompanhe o histórico de cada cliente.",
    path: "/clientes",
    icon: Users,
  },

  {
    title: "Financeiro",
    description: "Acesse seu acompanhamento financeiro",
    path: "/financeiro",
    icon: GitGraphIcon,
  },

  {
    title: " Cadastro de Clientes",
    description: "Cadastre seus clientes no seu banco de dados.",
    path: "/cadastro",
    icon: Database,
  },

  {
    title: "Agenda",
    description: "Organize atendimentos sem conflitos.",
    path: "/agenda",
    icon: Calendar,
  },
  {
    title: "Equipe",
    description: "Gerencie funcionários e permissões.",
    path: "/registro",
    icon: UserPlus,
  },
  {
    title: "IA & Mensagens",
    description: "Campanhas inteligentes para reativar clientes.",
    path: "/respostaIA",
    icon: Sparkles,
  },
];

export default function HomePage({ commerce }: HomePageProps) {
  const { userName, login, logout, businessName } = useUser();
  const [inputName, setInputName] = useState("");
  const [password, setPassword] = useState("");
  const [errorAuth, setErrorAuth] = useState("");
  const router = useRouter();

  const theme = commerceThemes[commerce];
  const isLoggedIn = !!userName;

  async function handlerLogout() {
    await logout();
    localStorage.removeItem("access_token");
    router.replace("/");
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameUser = inputName.trim().toLowerCase();
    const passwordUser = password.trim();
    if (!nameUser) {
      setErrorAuth("Acesso negado");
      return;
    }
    try {
      const data = await loginUser(nameUser, passwordUser);
      login(data.userName, data.role === "ADMIN", data.commerce, data.businessName);
      setErrorAuth("");
    } catch {
      toast.error("Acesso não autorizado");
    }
  };

  function handleIA() {
    if (!isLoggedIn) {
      toast.error("Você não tem acesso a esse recurso");
      return;
    }
    router.push("/respostaIA");
  }

  return (
    <main
      className="min-h-screen w-screen bg-[#080B0E] relative"
      style={{ "--theme-primary": theme.primaryHex } as React.CSSProperties}
    >
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={theme.image}
          alt=""
          className="w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#080B0E] via-[#080B0E]/85 to-[#080B0E]/70" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: theme.primaryHex }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-white/5">
        <h1 className="text-lg font-black tracking-tight" style={{ color: theme.primaryHex }}>
          {businessName}
        </h1>
        {isLoggedIn ? (
          <button
            onClick={handlerLogout}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
          >
            Sair
          </button>
        ) : (
          <button
            onClick={() => router.push("/registroBusiness")}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-zinc-300 hover:text-white"
            style={{ borderColor: `${theme.primaryHex}40`, background: `${theme.primaryHex}10` }}
          >
            Registrar negócio →
          </button>
        )}
      </nav>

      <div className="relative z-10 max-w-[1700px] mx-auto px-8 lg:px-12">
        {/* PRÉ-LOGIN */}
        {!isLoggedIn && (
          <div className="min-h-[calc(100vh-57px)] flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-12">
            <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold w-fit mx-auto lg:mx-0"
                style={{
                  borderColor: `${theme.primaryHex}40`,
                  color: theme.primaryHex,
                  background: `${theme.primaryHex}10`,
                }}
              >
                <Sparkles size={12} /> Plataforma de gestão inteligente
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                Gerencie seu negócio
                <br />
                <span style={{ color: theme.primaryHex }}>com inteligência</span>
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                {theme.subtitle}
              </p>
              <button
                onClick={() => router.push("/registroBusiness")}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition cursor-pointer w-fit mx-auto lg:mx-0 ${theme.loginBtnClass}`}
              >
                Começar agora →
              </button>
            </div>

            {/* Card login */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div
                className="rounded-2xl border p-7 flex flex-col gap-5 backdrop-blur-xl"
                style={{ borderColor: `${theme.primaryHex}25`, background: "rgba(15,19,24,0.9)" }}
              >
                <div>
                  <h3 className="text-xl font-bold text-white">Entrar na plataforma</h3>
                  <p className="text-zinc-500 text-sm mt-0.5">Acesse sua conta</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Nome de usuário</label>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="Ex: cris"
                      required
                      className="w-full px-4 py-2.5 text-sm bg-[#080B0E] text-white rounded-xl border focus:outline-none transition"
                      style={{ borderColor: `${theme.primaryHex}30` }}
                      onFocus={(e) => (e.target.style.borderColor = theme.primaryHex)}
                      onBlur={(e) => (e.target.style.borderColor = `${theme.primaryHex}30`)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Senha</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      className="w-full px-4 py-2.5 text-sm bg-[#080B0E] text-white rounded-xl border focus:outline-none transition"
                      style={{ borderColor: `${theme.primaryHex}30` }}
                      onFocus={(e) => (e.target.style.borderColor = theme.primaryHex)}
                      onBlur={(e) => (e.target.style.borderColor = `${theme.primaryHex}30`)}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-2.5 font-bold text-sm rounded-xl transition cursor-pointer mt-1 ${theme.loginBtnClass}`}
                  >
                    Entrar
                  </button>
                </form>

                {errorAuth && <p className="text-center text-sm text-red-400">{errorAuth}</p>}

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span className="text-xs text-zinc-600">ou</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>

                <button
                  onClick={() => router.push("/registroBusiness")}
                  className="w-full py-2.5 text-sm font-semibold rounded-xl border transition cursor-pointer text-zinc-400 hover:text-white hover:border-zinc-600"
                  style={{
                    borderColor: `${theme.primaryHex}20`,
                    background: `${theme.primaryHex}05`,
                  }}
                >
                  Criar conta — Registrar negócio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PÓS-LOGIN */}
        {isLoggedIn && (
          <div className="py-8 flex flex-col gap-6">
            {/* Hero banner */}
            <section
              className="relative overflow-hidden min-h-[420px] rounded-[32px] border p-8 lg:p-12"
              style={{
                borderColor: `${theme.primaryHex}20`,
                background: "linear-gradient(180deg,#101720 0%,#0A1018 100%)",
              }}
            >
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none"
                style={{ background: theme.primaryHex, opacity: 0.12 }}
              />
              <img
                src={theme.image}
                alt={theme.imageAlt}
                className="absolute right-0 bottom-0 h-[420px] object-contain opacity-60 pointer-events-none select-none"
              />

              <div className="relative z-10 max-w-xl">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                  style={{ background: `${theme.primaryHex}15`, color: theme.primaryHex }}
                >
                  <Sparkles size={12} /> Plataforma Inteligente
                </div>

                <h1 className="text-5xl lg:text-6xl font-black text-white leading-none">
                  {businessName}
                </h1>

                <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-md">
                  {theme.subtitle}
                </p>

                <button
                  onClick={handleIA}
                  className="mt-8 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: theme.primaryHex,
                    color: "#000",
                    boxShadow: `0 4px 24px ${theme.primaryHex}40`,
                  }}
                >
                  Gerar campanha com IA →
                </button>
              </div>
            </section>

            {/* Action cards — compactos */}
            <section>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">Acesso rápido</h3>
                <p className="text-zinc-500 text-sm mt-0.5">Tudo o que você precisa para operar.</p>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {actions.map(({ title, description, path, icon: Icon }) => (
                  <button
                    key={path}
                    onClick={() => router.push(path)}
                    className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
                    style={{
                      background: "linear-gradient(180deg,#101720 0%, #0A1018 100%)",
                      border: `1px solid ${theme.primaryHex}18`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                      style={{
                        background: `radial-gradient(circle at top right, ${theme.primaryHex}25, transparent 65%)`,
                      }}
                    />

                    <div className="relative z-10 flex flex-col gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: `${theme.primaryHex}15` }}
                      >
                        <Icon size={18} style={{ color: theme.primaryHex }} />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white">{title}</h4>
                        <p className="text-zinc-500 text-xs leading-relaxed mt-1">{description}</p>
                      </div>

                      <div
                        className="inline-flex items-center gap-1 text-xs font-semibold group-hover:translate-x-0.5 transition-transform"
                        style={{ color: theme.primaryHex }}
                      >
                        Abrir <ArrowRight size={12} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* IAHighlight dinâmico */}
            <IAHighlight
              onNavigate={() => router.push("/respostaIA")}
              isLoggedIn={isLoggedIn}
              theme={theme}
              businessName={businessName}
            />

            <p className="text-center text-zinc-700 text-xs pb-4">
              © 2025 {businessName}. Todos os direitos reservados.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
