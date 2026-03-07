"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";
import ConfirmModal from "./confimModal";
import { deleteCliente } from "@/services/customer/delete";
import { UpdateClientDTO } from "@/services/customer/patch";
import { patchClientList } from "@/services/customer/patch";
import { getClients } from "@/services/customer/get";

type Client = {
  id: string;
  customer_name: string;
  pet_name: string;
  created_at: string;
  isAdmin: string;
  address: string;
  last_bath: string;
  number_customer: string;
  pet_breed: string;
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString || isNaN(Date.parse(dateString))) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export default function ClientsList() {
  const [clients, setClient] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [dataUpdated, setDataUpdated] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const router = useRouter();
  const { login, userName, logout, isAdmin } = useUser();
  const [modelDeleteOpen, setModelDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [searchData, setSearchData] = useState("");
  const [editForm, setEditForm] = useState<UpdateClientDTO>({
    customer_name: "",
    pet_name: "",
    address: "",
    number_customer: "",
    pet_breed: "",
    last_bath: "",
  });

  const hasFetched = useRef(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  function handleEdit(client: Client) {
    setEditClient(client);
    setEditForm({
      customer_name: client.customer_name || "",
      pet_name: client.pet_name || "",
      address: client.address || "",
      last_bath: client.last_bath ? client.last_bath.split("T")[0] : "",
      number_customer: client.number_customer || "",
      pet_breed: client.pet_breed || "",
    });
  }

  const openDeleteModal = (client: Client) => {
    setClientToDelete(client);
    setModelDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!clientToDelete) return;

      await deleteCliente(clientToDelete.id);

      toast.success("Cliente excluído com sucesso");

      const updated = clients.filter((c) => c.id !== clientToDelete.id);
      setClient(updated);
    } catch (error) {
      toast.error("Erro ao excluir cliente");
    }
  };

  const handleCancel = () => {
    setEditClient(null);
    setEditForm({
      customer_name: "",
      pet_name: "",
      address: "",
      last_bath: "",
      number_customer: "",
      pet_breed: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!editClient) return;

    try {
      const response = await patchClientList(editClient.id, editForm);

      if (response.status === 204 || response.ok) {
        setClient((prev) =>
          prev.map((c) => (c.id === editClient.id ? { ...c, ...editForm, id: String(c.id) } : c)),
        );

        toast.success("Dados Atualizados");
        handleCancel();
        setDataUpdated(true);
      }
    } catch (erro) {
      toast.error("Erro na atualização");
    }
  };

  useEffect(() => {
    if (!isAdmin || hasFetched.current) {
      return;
    }

    hasFetched.current = true;

    const fecthClientes = async () => {
      try {
        const data = await getClients();
        setClient([...data]);
      } catch (error) {
        setErro("Não foi possível localizar os clientes");
      } finally {
        setLoading(false);
      }
    };

    fecthClientes();
  }, [isAdmin]);

  const clientsFilters = useMemo(() => {
    if (searchData.trim() === "") return clients;

    return clients.filter((client) =>
      client.customer_name?.toLowerCase().includes(searchData.toLowerCase()),
    );
  }, [searchData, clients]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex items-center justify-center p-6">
      <div className="bg-[#1A1D22] p-6 md:p-10 rounded-2xl border border-amber-500/20 shadow-2xl [box-shadow:_0_0_40px_rgba(251,191,36,0.1)] max-w-6xl w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Sair
          </button>
        </div>

        <h1 className="text-3xl font-bold text-amber-400 text-center mb-8">Clientes Cadastrados</h1>

        <div className="flex justify-center">
          <input
            type="text"
            className=" mb-10 text-base text-white p-1 rounded border border-amber-500/30 w-full max-w-md p-2"
            placeholder="Digite o nome do cliente..."
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
          />
        </div>

        {!loading && !erro && searchData && clientsFilters.length === 0 && (
          <p className="text-3xl font-bold text-amber-400 text-center mb-8">
            Nenhum cliente encontrado com esse nome
          </p>
        )}

        {loading && <p className="text-center text-gray-400">Carregando...</p>}
        {erro && <p className="text-center text-red-500">{erro}</p>}

        {!loading && !erro && clientsFilters.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-amber-500/20">
            <table className="min-w-[800px] w-full text-left border-collapse">
              <thead className="bg-[#0B0E11]">
                <tr>
                  <th className="px-4 py-4 text-amber-300 text-base uppercase tracking-wider">
                    Dono
                  </th>
                  <th className="px-4 py-4 text-amber-300 text-base uppercase tracking-wider">
                    Pet
                  </th>
                  <th className="px-4 py-4 text-amber-300 text-base uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-4 py-4 text-amber-300 text-base uppercase tracking-wider">
                    Telefone
                  </th>

                  <th className="px-4 py-4 text-amber-300 text-base uppercase tracking-wider">
                    Raça
                  </th>
                  <th className="px-4 py-4 text-amber-300 text-base uppercase tracking-wider">
                    Último Banho
                  </th>

                  <th className="px-4 py-4 text-amber-300 text-base uppercase tracking-wider ">
                    Criando em
                  </th>

                  <th className="px-4 py-4 text-amber-300 text-base uppercase ">Ações</th>
                </tr>
              </thead>

              <tbody className="bg-[#0B0E11] divide-y divide-amber-500/10">
                {clientsFilters.map((client, index) => (
                  <tr key={client.id} className="hover:bg-amber-500/5 transition duration-200">
                    {editClient?.id === client.id ? (
                      /* MODO EDIÇÃO */
                      <>
                        <td className="p-2">
                          <input
                            name="customer_name"
                            value={editForm.customer_name}
                            onChange={handleChange}
                            className="w-full  text-base text-white p-1 rounded border border-amber-500/30"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            name="pet_name"
                            value={editForm.pet_name}
                            onChange={handleChange}
                            className="w-full  text-base text-white p-1 rounded border border-amber-500/30"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            name="address"
                            value={editForm.address}
                            onChange={handleChange}
                            className="w-full  text-base text-white p-1 rounded border border-amber-500/30"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            name="number_customer"
                            value={editForm.number_customer}
                            onChange={handleChange}
                            className="w-full  text-base text-white p-1 rounded border border-amber-500/30"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            name="pet_breed"
                            value={editForm.pet_breed}
                            onChange={handleChange}
                            className="w-full  text-base text-white p-1 rounded border border-amber-500/30"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            name="last_bath"
                            type="date"
                            aria-label="último banho"
                            value={editForm.last_bath}
                            onChange={handleChange}
                            className="w-full  text-base text-white p-1 rounded border border-amber-500/30"
                          />
                        </td>

                        <td className="text-base text-white p-4  border-amber-500/30">
                          {formatDate(client.created_at)}
                        </td>

                        <td className="p-2 text-center space-x-2">
                          <button
                            onClick={handleSave}
                            aria-label="Salvar"
                            className="text-green-400 text-base hover:scale-125 transition cursor-pointer"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-400 text-base hover:scale-125 transition cursor-pointer"
                            aria-label="Cancelar"
                          >
                            X
                          </button>
                        </td>
                      </>
                    ) : (
                      /* MODO NORMAL */
                      <>
                        <td className="px-4 py-3 text-white text-base">{client.customer_name}</td>
                        <td className="px-4 py-3 text-white text-base font-medium">
                          {client.pet_name}
                        </td>
                        <td className="px-4 py-3 text-white text-base truncate max-w-[150px]">
                          {client.address || "—"}
                        </td>
                        <td className="px-4 py-3 text-white text-base">
                          {client.number_customer || "—"}
                        </td>
                        <td className="px-4 py-3 text-white text-base">
                          {client.pet_breed || "—"}
                        </td>
                        <td className="px-4 py-3 text-white text-base">
                          {client.last_bath ? formatDate(client.last_bath) : "Não registrado"}
                        </td>

                        <td className="px-4 py-3 text-white text-base">
                          {formatDate(client.created_at)}
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
                              aria-label="Excluir"
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
          <Button onClick={() => router.push("/")}>Voltar ao início</Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={modelDeleteOpen}
        onClose={() => setModelDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar exclusão"
        message={`Excluir cliente ${clientToDelete?.customer_name} e o pet ${clientToDelete?.pet_name}?`}
      />
    </main>
  );
}
