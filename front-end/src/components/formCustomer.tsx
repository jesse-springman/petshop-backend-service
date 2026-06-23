"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { cadastroData } from "@/services/cadastro";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import { commerceThemes } from "@/utils/Commercetheme";
import { Commerce } from "@/types/commerce";

export default function FormCadastro() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { commerce } = useUser();
  const theme = commerceThemes[(commerce ?? "PETSHOP") as Commerce];

  function maskWhatsapp(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  const rawPhone = phone.replace(/\D/g, "");

  const handleWhatsapp = (value: string) => {
    setPhone(maskWhatsapp(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Preencha o nome do cliente!");
      return;
    }

    if (rawPhone.length !== 11) {
      toast.error("Insira um número de WhatsApp válido com DDD (11 dígitos).");
      return;
    }

    setLoading(true);
    try {
      await cadastroData({ name, phone: rawPhone, address });
      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => router.push("/"), 2000);
    } catch {
      toast.error("Erro na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex items-center justify-center p-4">
      <div
        className="bg-[#1A1D22] p-6 md:p-10 rounded-2xl shadow-2xl max-w-lg w-full"
        style={{
          border: `1px solid ${theme.primaryHex}20`,
          boxShadow: `0 0 40px ${theme.primaryHex}20`,
        }}
      >
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: theme.primaryHex }}>
          Cadastro de Cliente
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2 text-lg">
                Nome do Cliente
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none transition"
                onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
                placeholder="Ex: Pedro"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-300 mb-2 text-lg">
                Telefone <span className="text-zinc-500 text-sm">(opcional)</span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-sm">
                  📱
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => handleWhatsapp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0B0E11] text-white rounded-xl border border-amber-500/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition placeholder-zinc-600"
                  onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
                  placeholder="(11) 99999-9999"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-gray-300 mb-2 text-lg">
                Endereço <span className="text-zinc-500 text-sm">(opcional)</span>
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none transition"
                onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
                placeholder="Av. Brasil, 123"
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} primaryHex={theme.primaryHex}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
        <Button onClick={() => router.push("/")} primaryHex={theme.primaryHex}>
          ← Voltar para início
        </Button>
      </div>
    </main>
  );
}
