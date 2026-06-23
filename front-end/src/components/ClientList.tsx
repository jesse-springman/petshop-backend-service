"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";
import ConfirmModal from "./confimModal";
import { deleteCliente } from "@/services/customer/delete";
import { UpdateClientDTO, patchClientList } from "@/services/customer/patch";
import { getClients } from "@/services/customer/get";
import { Client } from "@/types/clients";
import { commerceThemes } from "@/utils/Commercetheme";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString || isNaN(Date.parse(dateString))) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [modelDeleteOpen, setModelDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [searchData, setSearchData] = useState("");
  const [editForm, setEditForm] = useState<UpdateClientDTO>({
    name: "",
    phone: "",
    address: "",
  });

  const router = useRouter();
  const { logout, isAdmin, commerce } = useUser();
  const theme = commerceThemes[commerce ?? "PETSHOP"];
  const hasFetched = useRef(false);

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  function handleEdit(client: Client) {
    setEditClient(client);
    setEditForm({
      name: client.name || "",
      phone: client.phone || "",
      address: client.address || "",
    });
  }

  const handleCancel = () => {
    setEditClient(null);
    setEditForm({ name: "", phone: "", address: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editClient) return;
    try {
      await patchClientList(editClient.id, editForm);
      setClients((prev) => prev.map((c) => (c.id === editClient.id ? { ...c, ...editForm } : c)));
      toast.success("Dados atualizados");
      handleCancel();
    } catch {
      toast.error("Erro na atualização");
    }
  };

  const openDeleteModal = (client: Client) => {
    setClientToDelete(client);
    setModelDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    try {
      await deleteCliente(clientToDelete.id);
      toast.success("Cliente excluído com sucesso");
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
    } catch {
      toast.error("Erro ao excluir cliente");
    }
  };

  useEffect(() => {
    if (!isAdmin || hasFetched.current) return;
    hasFetched.current = true;

    const fetchClientes = async () => {
      try {
        const data = await getClients();
        setClients(data);

        if (data.length === 0) {
          setErro("Nenhum cliente cadastrado");
        }
      } catch {
        setErro("Não foi possível localizar os clientes");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [isAdmin]);

  const clientsFiltered = useMemo(() => {
    if (!searchData.trim()) return clients;
    return clients.filter((c) => c.name?.toLowerCase().includes(searchData.toLowerCase()));
  }, [searchData, clients]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] p-6">
      <div className="max-w-6xl mx-auto flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
        >
          Sair
        </button>
      </div>

      <div
        className="bg-[#1A1D22] p-6 md:p-10 rounded-2xl shadow-2xl max-w-6xl w-full mx-auto"
        style={{
          border: `1px solid ${theme.primaryHex}20`,
          boxShadow: `0 0 40px ${theme.primaryHex}10`,
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: theme.primaryHex }}>
          Clientes Cadastrados
        </h1>

        <div className="flex justify-center mb-10">
          <input
            className="text-base text-white p-2 rounded w-full max-w-md bg-[#0B0E11]"
            style={{ border: `1px solid ${theme.primaryHex}30` }}
            placeholder="Buscar por nome..."
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
          />
        </div>

        {!loading && searchData && clientsFiltered.length === 0 && (
          <p className="text-center text-xl mb-8" style={{ color: theme.primaryHex }}>
            Nenhum cliente encontrado
          </p>
        )}

        {loading && <p className="text-center text-gray-400">Carregando...</p>}
        {erro && <p className="text-center text-red-500">{erro}</p>}

        {!loading && !erro && clientsFiltered.length > 0 && (
          <div
            className="overflow-x-auto rounded-xl"
            style={{ border: `1px solid ${theme.primaryHex}20` }}
          >
            <table className="min-w-[600px] w-full text-left border-collapse">
              <thead className="bg-[#0B0E11]">
                <tr>
                  <th
                    className="px-4 py-4 text-base uppercase tracking-wider"
                    style={{ color: theme.primaryHex }}
                  >
                    Nome
                  </th>
                  <th
                    className="px-4 py-4 text-base uppercase tracking-wider"
                    style={{ color: theme.primaryHex }}
                  >
                    Telefone
                  </th>
                  <th
                    className="px-4 py-4 text-base uppercase tracking-wider"
                    style={{ color: theme.primaryHex }}
                  >
                    Endereço
                  </th>
                  <th
                    className="px-4 py-4 text-base uppercase tracking-wider"
                    style={{ color: theme.primaryHex }}
                  >
                    Criado em
                  </th>
                  <th
                    className="px-4 py-4 text-base uppercase tracking-wider"
                    style={{ color: theme.primaryHex }}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody
                className="bg-[#0B0E11] divide-y"
                style={{ borderColor: `${theme.primaryHex}10` }}
              >
                {clientsFiltered.map((client) => (
                  <tr
                    key={client.id}
                    className="transition duration-200"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = `${theme.primaryHex}08`)
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {editClient?.id === client.id ? (
                      <>
                        <td className="p-2">
                          <input
                            name="name"
                            value={editForm.name}
                            onChange={handleChange}
                            className="w-full text-base text-white p-1 rounded bg-[#0B0E11]"
                            style={{ border: `1px solid ${theme.primaryHex}30` }}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            name="phone"
                            value={editForm.phone}
                            onChange={handleChange}
                            className="w-full text-base text-white p-1 rounded bg-[#0B0E11]"
                            style={{ border: `1px solid ${theme.primaryHex}30` }}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            name="address"
                            value={editForm.address}
                            onChange={handleChange}
                            className="w-full text-base text-white p-1 rounded bg-[#0B0E11]"
                            style={{ border: `1px solid ${theme.primaryHex}30` }}
                          />
                        </td>
                        <td className="text-base text-white p-4">{formatDate(client.createdAt)}</td>
                        <td className="p-2 text-center space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-400 text-base hover:scale-125 transition cursor-pointer"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={handleCancel}
                            aria-label="cancelar edição"
                            className="text-red-400 text-base hover:scale-125 transition cursor-pointer"
                          >
                            X
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-white text-base">{client.name}</td>
                        <td className="px-4 py-3 text-white text-base">{client.phone || "—"}</td>
                        <td className="px-4 py-3 text-white text-base truncate max-w-[150px]">
                          {client.address || "—"}
                        </td>
                        <td className="px-4 py-3 text-white text-base">
                          {formatDate(client.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => handleEdit(client)}
                              className="hover:scale-125 transition cursor-pointer"
                              aria-label="editar"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => openDeleteModal(client)}
                              className="hover:scale-125 transition cursor-pointer"
                              aria-label="excluir"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button primaryHex={theme.primaryHex} onClick={() => router.push("/")}>
            Voltar ao início
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={modelDeleteOpen}
        onClose={() => setModelDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar exclusão"
        message={`Excluir o cliente ${clientToDelete?.name}?`}
      />
    </main>
  );
}
