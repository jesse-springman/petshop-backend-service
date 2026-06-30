"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { registerData } from "@/services/register";
import { useUser } from "@/context/UserContext";
import { commerceThemes } from "@/utils/Commercetheme";
import { Commerce } from "@/types/commerce";
import { getServices } from "@/services/servicesBusiness/get-service";
import { createService } from "@/services/servicesBusiness/post-service";
import { updateService } from "@/services/servicesBusiness/patch-service";
import { deleteService } from "@/services/servicesBusiness/delete-service";
import { ServiceType } from "@/types/serviceType";
import toast from "react-hot-toast";

type Tab = "equipe" | "servicos";

export default function FormRegister() {
  const [activeTab, setActiveTab] = useState<Tab>("equipe");

  const [nameUser, setNameUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [message, setMessage] = useState("");

  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);

  // hover states
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<Tab | null>(null);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [addServiceHovered, setAddServiceHovered] = useState(false);
  const [saveEditHovered, setSaveEditHovered] = useState(false);

  const router = useRouter();
  const { commerce, isAdmin } = useUser();
  const theme = commerceThemes[(commerce ?? "PETSHOP") as Commerce];

  useEffect(() => {
    if (activeTab === "servicos") fetchServices();
  }, [activeTab]);

  async function fetchServices() {
    setLoadingServices(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch {
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoadingServices(false);
    }
  }

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameUser || !password) {
      setMessage("Preencha todos os campos!");
      return;
    }
    if (confirmPassword !== password) {
      setMessage("Senhas estão diferentes");
      return;
    }

    setLoadingRegister(true);
    setMessage("");
    try {
      await registerData({ name: nameUser, password, role });
      setMessage("Cadastro realizado com sucesso!");
      setNameUser("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) {
      toast.error("Preencha nome e preço do serviço");
      return;
    }

    setLoadingCreate(true);
    try {
      await createService({ name: newServiceName, price: parseFloat(newServicePrice) });
      toast.success("Serviço cadastrado com sucesso!");
      setNewServiceName("");
      setNewServicePrice("");
      fetchServices();
    } catch (error: any) {
      toast.error(error.message ?? "Erro ao cadastrar serviço");
    } finally {
      setLoadingCreate(false);
    }
  };

  function handleStartEdit(s: ServiceType) {
    setEditingId(s.id);
    setEditName(s.name);
    setEditPrice(String(s.price));
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  }

  async function handleSaveEdit(id: string) {
    if (!editName || !editPrice) {
      toast.error("Preencha nome e preço");
      return;
    }

    setLoadingEdit(true);
    try {
      const updated = await updateService(id, { name: editName, price: parseFloat(editPrice) });
      setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Serviço atualizado!");
      handleCancelEdit();
    } catch {
      toast.error("Erro ao atualizar serviço");
    } finally {
      setLoadingEdit(false);
    }
  }

  const handleDeleteService = async (id: string, name: string) => {
    try {
      await deleteService(id);
      toast.success(`Serviço "${name}" removido`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error("Erro ao remover serviço");
    }
  };

  const formatPrice = (price: string | number) =>
    Number(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const inputClass = `w-full px-4 py-3 bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none transition font-sans`;
  const inlineInputClass = `flex-1 px-3 py-1.5 bg-[#0B0E11] border border-gray-700 rounded-lg text-white text-sm focus:outline-none transition font-sans`;

  // handler reutilizável para hover em inputs
  function inputHoverEnter(e: React.MouseEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = `${theme.primaryHex}60`;
  }
  function inputHoverLeave(e: React.MouseEvent<HTMLInputElement>) {
    if (document.activeElement !== e.currentTarget) {
      e.currentTarget.style.borderColor = "rgb(55,65,81)";
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex items-center justify-center p-4 font-sans">
      <div
        className="bg-[#1A1D22] p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-lg transition-all duration-300"
        style={{
          border: `1px solid ${theme.primaryHex}20`,
          boxShadow: `0 0 40px ${theme.primaryHex}20`,
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-6" style={{ color: theme.primaryHex }}>
          Equipe & Serviços
        </h1>

        {/* Abas */}
        <div className="flex gap-2 mb-8 border-b" style={{ borderColor: `${theme.primaryHex}20` }}>
          {(["equipe", ...(isAdmin ? ["servicos"] : [])] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              onMouseEnter={() => setHoveredTab(tab)}
              onMouseLeave={() => setHoveredTab(null)}
              className="cursor-pointer px-4 py-2 text-sm font-semibold capitalize transition-all duration-200"
              style={
                activeTab === tab
                  ? { color: theme.primaryHex, borderBottom: `2px solid ${theme.primaryHex}` }
                  : { color: hoveredTab === tab ? `${theme.primaryHex}aa` : "rgb(113,113,122)" }
              }
            >
              {tab === "equipe" ? "👥 Equipe" : "🛎️ Serviços"}
            </button>
          ))}
        </div>

        {/* Aba Equipe */}
        {activeTab === "equipe" && (
          <form onSubmit={handleSubmitRegister} className="space-y-5">
            <div>
              <label htmlFor="nameUser" className="block text-gray-300 mb-2 text-sm font-medium">
                Nome do Colaborador
              </label>
              <input
                type="text"
                id="nameUser"
                value={nameUser}
                onChange={(e) => setNameUser(e.target.value)}
                className={inputClass}
                onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
                onMouseEnter={inputHoverEnter}
                onMouseLeave={inputHoverLeave}
                placeholder="Ex: Pedro"
                disabled={loadingRegister}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 mb-2 text-sm font-medium">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
                onMouseEnter={inputHoverEnter}
                onMouseLeave={inputHoverLeave}
                disabled={loadingRegister}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-300 mb-2 text-sm font-medium"
              >
                Confirmação de senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
                onMouseEnter={inputHoverEnter}
                onMouseLeave={inputHoverLeave}
                disabled={loadingRegister}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-3 text-sm font-medium">Função</label>
              <div className="flex gap-3">
                {(["USER", "ADMIN"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="cursor-pointer px-6 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-95"
                    style={
                      role === r
                        ? {
                            background: theme.primaryHex,
                            color: "#000",
                            borderColor: theme.primaryHex,
                          }
                        : { background: "#0B0E11", color: "#fff", borderColor: "rgb(55,65,81)" }
                    }
                    onMouseEnter={(e) => {
                      if (role !== r) {
                        e.currentTarget.style.borderColor = `${theme.primaryHex}60`;
                        e.currentTarget.style.color = theme.primaryHex;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (role !== r) {
                        e.currentTarget.style.borderColor = "rgb(55,65,81)";
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                  >
                    {r === "USER" ? "Usuário" : "Admin"}
                  </button>
                ))}
              </div>
            </div>

            {message && (
              <p
                className={`text-center text-sm ${message.includes("sucesso") ? "text-green-400" : "text-red-400"}`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loadingRegister}
              onMouseEnter={() => setSubmitHovered(true)}
              onMouseLeave={() => setSubmitHovered(false)}
              className="cursor-pointer w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              style={{
                background: theme.primaryHex,
                color: "#000",
                opacity: submitHovered ? 0.85 : 1,
                boxShadow: submitHovered ? `0 4px 20px ${theme.primaryHex}40` : "none",
                transform: submitHovered ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              {loadingRegister ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        )}

        {/* Aba Serviços */}
        {activeTab === "servicos" && isAdmin && (
          <div className="flex flex-col gap-6">
            <form onSubmit={handleCreateService} className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Novo Serviço
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Nome do serviço"
                  className="flex-1 px-4 py-2.5 bg-[#0B0E11] border border-gray-700 rounded-lg text-white text-sm focus:outline-none transition font-sans"
                  onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
                  onMouseEnter={inputHoverEnter}
                  onMouseLeave={inputHoverLeave}
                />
                <input
                  type="number"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  placeholder="Preço"
                  min="0"
                  step="0.01"
                  className="w-28 px-4 py-2.5 bg-[#0B0E11] border border-gray-700 rounded-lg text-white text-sm focus:outline-none transition font-sans"
                  onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
                  onMouseEnter={inputHoverEnter}
                  onMouseLeave={inputHoverLeave}
                />
              </div>
              <button
                type="submit"
                disabled={loadingCreate}
                onMouseEnter={() => setAddServiceHovered(true)}
                onMouseLeave={() => setAddServiceHovered(false)}
                className="cursor-pointer w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: theme.primaryHex,
                  color: "#000",
                  opacity: addServiceHovered ? 0.85 : 1,
                  boxShadow: addServiceHovered ? `0 4px 20px ${theme.primaryHex}40` : "none",
                  transform: addServiceHovered ? "translateY(-1px)" : "translateY(0)",
                }}
              >
                {loadingCreate ? "Cadastrando..." : "+ Adicionar Serviço"}
              </button>
            </form>

            <div className="h-px" style={{ background: `${theme.primaryHex}15` }} />

            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Serviços Cadastrados
              </h2>

              {loadingServices ? (
                <p className="text-zinc-500 text-sm text-center py-4">Carregando...</p>
              ) : services.length === 0 ? (
                <p className="text-zinc-600 text-sm text-center py-6">
                  Nenhum serviço cadastrado ainda
                </p>
              ) : (
                services.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col px-4 py-3 rounded-xl border gap-2 transition-all duration-200"
                    onMouseEnter={() => setHoveredServiceId(s.id)}
                    onMouseLeave={() => setHoveredServiceId(null)}
                    style={{
                      borderColor:
                        hoveredServiceId === s.id
                          ? `${theme.primaryHex}40`
                          : `${theme.primaryHex}15`,
                      background:
                        hoveredServiceId === s.id
                          ? `${theme.primaryHex}0d`
                          : `${theme.primaryHex}05`,
                      transform: hoveredServiceId === s.id ? "translateX(3px)" : "translateX(0)",
                    }}
                  >
                    {editingId === s.id ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className={inlineInputClass}
                            onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
                            onMouseEnter={inputHoverEnter}
                            onMouseLeave={inputHoverLeave}
                            placeholder="Nome do serviço"
                          />
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-24 px-3 py-1.5 bg-[#0B0E11] border border-gray-700 rounded-lg text-white text-sm focus:outline-none transition font-sans"
                            onFocus={(e) => (e.currentTarget.style.borderColor = theme.primaryHex)}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "rgb(55,65,81)")}
                            onMouseEnter={inputHoverEnter}
                            onMouseLeave={inputHoverLeave}
                            placeholder="Preço"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(s.id)}
                            disabled={loadingEdit}
                            onMouseEnter={() => setSaveEditHovered(true)}
                            onMouseLeave={() => setSaveEditHovered(false)}
                            className="cursor-pointer flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 disabled:opacity-50"
                            style={{
                              background: theme.primaryHex,
                              color: "#000",
                              opacity: saveEditHovered ? 0.85 : 1,
                              boxShadow: saveEditHovered
                                ? `0 2px 12px ${theme.primaryHex}40`
                                : "none",
                            }}
                          >
                            {loadingEdit ? "Salvando..." : "Salvar"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="cursor-pointer flex-1 py-1.5 rounded-lg text-xs font-semibold border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all duration-200"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{s.name}</p>
                          <p className="text-xs font-bold" style={{ color: theme.primaryHex }}>
                            {formatPrice(s.price)}
                          </p>
                        </div>
                        {/* Botões aparecem só no hover do card */}
                        <div
                          className="flex items-center gap-1 transition-all duration-200"
                          style={{ opacity: hoveredServiceId === s.id ? 1 : 0 }}
                        >
                          <button
                            onClick={() => handleStartEdit(s)}
                            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = `${theme.primaryHex}20`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                            aria-label="editar serviço"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteService(s.id, s.name)}
                            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(248,113,113,0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                            aria-label="remover serviço"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button onClick={() => router.push("/")} primaryHex={theme.primaryHex}>
            ← Voltar para início
          </Button>
        </div>
      </div>
    </main>
  );
}
