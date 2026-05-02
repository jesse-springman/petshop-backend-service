"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "../services/login";
import toast from "react-hot-toast";
import { IAHighlight } from "../components/HightLigthIA";
import { ActionCard } from "../components/ActionCard";

export default function HomePage() {
  const { userName, login, logout } = useUser();
  const [inputName, setInputName] = useState("");
  const [password, setPassword] = useState("");
  const [errorAuth, setErrorAuth] = useState("");
  const router = useRouter();

  const isLoggedIn = !!userName;

  async function handlerLogout() {
    await logout();
    router.replace("/");
    localStorage.removeItem("access_token");
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
      login(data.userName, data.role === "ADMIN");
      setErrorAuth("");
    } catch {
      toast.error("Acesso não autorizado");
    }
  };

  const actions = [
    {
      title: "Cadastro de Clientes",
      description: "Gerencie informações dos seus clientes.",
      path: "/cadastro",
      icon: "👥",
    },
    {
      title: "Agenda",
      description: "Visualize e gerencie os agendamentos.",
      path: "/agenda",
      icon: "📅",
    },
    {
      title: "Cadastro de Funcionários",
      description: "Gerencie sua equipe de trabalho.",
      path: "/registro",
      icon: "👤",
    },
    {
      title: "Ver Clientes",
      description: "Visualize todos os clientes cadastrados.",
      path: "/clientes",
      icon: "📋",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] relative">
      {isLoggedIn && (
        <div className="flex justify-end p-3">
          <button
            onClick={handlerLogout}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
          >
            Sair
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-4 pb-2 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
          <div className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px]">
            <img
              src="/images/pit.png"
              alt="New-Pettz"
              className="w-full rounded-full shadow-2xl [box-shadow:_0_0_40px_rgba(251,191,36,0.2)] mb-5"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 justify-center">
          <div
            className={`bg-[#1A1D22]/90 backdrop-blur-lg px-8 py-6 rounded-3xl shadow-2xl border border-amber-500/50 transition-all duration-700 ${
              isLoggedIn ? "opacity-0 pointer-events-none h-0 overflow-hidden p-0" : "opacity-100"
            }`}
          >
            <h2 className="text-2xl font-bold text-amber-400 mb-5 text-center">Acesso Admin</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Digite seu nome"
                required
                className="w-full px-5 py-3 text-base bg-[#0B0E11] text-white rounded-xl border border-amber-500/40 focus:border-amber-400 focus:outline-none transition"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                required
                className="w-full px-5 py-3 text-base bg-[#0B0E11] text-white rounded-xl border border-amber-500/40 focus:border-amber-400 focus:outline-none transition"
              />
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-base rounded-xl transition cursor-pointer"
              >
                Entrar
              </button>
            </form>
            {errorAuth && (
              <p className="mt-3 text-center text-base font-bold text-red-400">{errorAuth}</p>
            )}
          </div>

          <div
            className={`transition-all duration-700 ${
              isLoggedIn ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
            }`}
          >
            <h2 className="text-3xl font-bold text-amber-400">Seja bem-vindo, {userName}!</h2>
            <p className="text-gray-300 mt-1 text-lg">Você tem acesso completo ao sistema.</p>
            <h1 className="text-5xl md:text-6xl font-bold text-amber-400 tracking-wider drop-shadow-2xl mt-15">
              New-Pettz
            </h1>

            <p className="text-lg text-gray-300 max-w-lg">
              Seu petshop moderno e confiável. Cadastre clientes, gerencie atendimentos e cuide dos
              seus pets com tecnologia de ponta.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-4">
        <IAHighlight onNavigate={() => router.push("/respostaIA")} isLoggedIn={isLoggedIn} />
      </div>

      <div
        className={`max-w-7xl mx-auto px-6 pb-6 transition-all duration-700 ${
          isLoggedIn ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
        }`}
      >
        <h3 className="text-base font-semibold text-zinc-400 mb-4 uppercase tracking-widest">
          Acesse as principais funcionalidades
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map(({ title, description, path, icon }) => (
            <ActionCard
              key={path}
              title={title}
              description={description}
              icon={icon}
              onClick={() => router.push(path)}
            />
          ))}
        </div>
      </div>

      <footer className="text-center text-gray-500 text-sm py-8">
        © 2025 New-Pettz. Todos os direitos reservados.
      </footer>
    </main>
  );
}
