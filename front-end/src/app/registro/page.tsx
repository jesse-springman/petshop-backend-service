"use client";

import React, { useState } from "react";
import { forbidden, useRouter } from "next/navigation";
import Button from "@/components/Button";
import { registerData } from "@/services/register";
import { useUser } from "@/context/UserContext";
import { commerceThemes } from "@/utils/Commercetheme";
import { Commerce } from "@/types/commerce";

export default function FormRegister() {
  const [nameUser, setNameUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const { commerce } = useUser();
  const theme = commerceThemes[(commerce ?? "PETSHOP") as Commerce];

  const handleSubimit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameUser || !password) {
      setMessage("Preencha todos os campos!");
      return;
    }

    if (confirmPassword !== password) {
      setMessage("Erro, senhas estão diferentes");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await registerData({
        name: nameUser,
        password,
        role,
      });

      setMessage("Cadastro realizado com sucesso!");
      setNameUser("");
      setPassword("");

      setTimeout(() => router.push("/"), 3000);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro ao cadastrar. Tente novamente.";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex items-center justify-center p-4">
      <div
        className="bg-[#1A1D22] p-6 md:p-10 rounded-2xl shadow-2xl max-w-lg w-auto"
        style={{
          border: `1px solid ${theme.primaryHex}20`,
          boxShadow: `0 0 40px ${theme.primaryHex}20`,
        }}
      >
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: theme.primaryHex }}>
          Cadastro de Funcionários
        </h1>

        <form onSubmit={handleSubimit} className="space-y-6">
          <div>
            <label htmlFor="nameUser" className="block text-gray-300 mb-2 text-lg">
              Nome do Colaborador
            </label>

            <input
              type="text"
              id="nameUser"
              value={nameUser}
              onChange={(e) => setNameUser(e.target.value)}
              className="w-full px-4 py-3 bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none transition mb-4"
              onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
              placeholder="Ex: Pedro"
              disabled={loading}
            />

            <label htmlFor="password" className="block text-gray-300 mb-2 text-lg">
              Senha
            </label>

            <input
              id="password"
              className="w-full px-4 py-3 bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none transition mb-4"
              onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2 text-lg">
              Confirmação de senha
            </label>

            <input
              id="confirmPassword"
              className="w-full px-4 py-3 bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none transition mb-4"
              onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
              type="password"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
              disabled={loading}
            />

            <label className="block mt-5 text-gray-300 mb-3 text-lg">Função</label>

            <div className="flex gap-4">
              {/* USER */}
              <label
                className={`px-6 py-3 rounded-xl border cursor-pointer transition
      ${
        role === "USER"
          ? { background: theme.primaryHex, color: "#000", borderColor: theme.primaryHex }
          : { background: "#0B0E11", color: "#fff", borderColor: "rgb(55,65,81)" }
      }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={role === "USER"}
                  onChange={() => setRole("USER")}
                  className="hidden"
                  disabled={loading}
                />
                Usuário
              </label>

              {/* ADMIN */}
              <label
                className={`px-6 py-3 rounded-xl border cursor-pointer transition
      ${
        role === "ADMIN"
          ? { background: theme.primaryHex, color: "#000", borderColor: theme.primaryHex }
          : { background: "#0B0E11", color: "#fff", borderColor: "rgb(55,65,81)" }
      }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={role === "ADMIN"}
                  onChange={() => setRole("ADMIN")}
                  className="hidden"
                  disabled={loading}
                />
                Admin
              </label>
            </div>
          </div>

          {message && (
            <p
              className={`text-center text-lg ${
                message.includes("sucesso") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <Button type="submit" disabled={loading} primaryHex={theme.primaryHex}>
            {loading ? "Cadastrando" : "Cadastrar"}
          </Button>
        </form>

        <Button onClick={() => router.push("/")} primaryHex={theme.primaryHex}>
          ← Voltar para início
        </Button>
      </div>
    </main>
  );
}
