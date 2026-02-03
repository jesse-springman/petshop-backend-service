'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';
import ConfirmModal from './confimModal';

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

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export default function ClientsList() {
  const [clients, setClient] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [dataUpdated, setDataUpdated] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editForm, setEditForm] = useState({
    customer_name: '',
    pet_name: '',
    address: '',
    number_customer: '',
    pet_breed: '',
    last_bath: '',
  });
  const router = useRouter();
  const { login, userName, logout, isAdmin } = useUser();
  const [modelDeleteOpen, setModelDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async function handleLogout() {
    await logout();
    router.replace('/');
  }

  function handleEdit(client: Client) {
    setEditClient(client);
    setEditForm({
      customer_name: client.customer_name || '',
      pet_name: client.pet_name || '',
      address: client.address || '',
      last_bath: client.last_bath ? client.last_bath.split('T')[0] : '',
      number_customer: client.number_customer || '',
      pet_breed: client.pet_breed || '',
    });
  }

  const openDeleteModal = (client: Client) => {
    setClientToDelete(client);
    setModelDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;

    try {
      const response = await fetch(`${API_URL}/clientes/${clientToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setClient(clients.filter((c) => c.id !== clientToDelete.id));
        toast.success('Cliente excluído com sucesso');
      } else {
        toast.error('Erro ao excluir cliente');
      }
    } catch (error) {
      toast.error('Erro ao excluir cliente');
    }
  };

  const handleCancel = () => {
    setEditClient(null);
    setEditForm({
      customer_name: '',
      pet_name: '',
      address: '',
      last_bath: '',
      number_customer: '',
      pet_breed: '',
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
      const response = await fetch(`${API_URL}/clientes/${editClient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.status === 204 || response.ok) {
        setClient(
          clients.map((c) =>
            c.id === editClient.id ? { ...c, ...editForm } : c,
          ),
        );
        toast.success('Dados Atualizados');
        handleCancel();
        setDataUpdated(true);
      } else {
        toast.error('Erro na Atualização de dados');
      }
    } catch (error) {
      toast.error('Erro na conexão');
      console.log(erro);
    }
  };

  useEffect(() => {
    const getDataClients = async () => {
      try {
        const response = await fetch(`${API_URL}/clientes`);
        if (!response.ok) throw new Error('Erro na busca');
        const data = await response.json();
        setClient(data);
        if (!isAdmin) router.push('/');
      } catch (error) {
        setErro('Não foi possível localizar os clientes.');
      } finally {
        setLoading(false);
      }
    };
    getDataClients();
  }, [isAdmin]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex items-center justify-center p-6">
      {/* MUDANÇA AQUI: max-w-6xl para centralizar e não esticar demais */}
      <div className="bg-[#1A1D22] p-6 md:p-10 rounded-2xl border border-amber-500/20 shadow-2xl [box-shadow:_0_0_40px_rgba(251,191,36,0.1)] max-w-9/12 w-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-300 font-medium cursor-pointer"
          >
            Sair
          </button>
        </div>

        <h1 className="text-3xl font-bold text-amber-400 text-center mb-8">
          Clientes Cadastrados
        </h1>

        {loading && <p className="text-center text-gray-400">Carregando...</p>}
        {erro && <p className="text-center text-red-500">{erro}</p>}

        {!loading && !erro && clients.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-amber-500/20">
            <table className="w-full text-left border-collapse">
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

                  <th className="px-4 py-4 text-amber-300 text-base uppercase tracking-wider text-center">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="bg-[#0B0E11] divide-y divide-amber-500/10">
                {clients.map((client, index) => (
                  <tr
                    key={client.id || index}
                    className="hover:bg-amber-500/5 transition duration-200"
                  >
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
                            value={editForm.last_bath}
                            onChange={handleChange}
                            className="w-full  text-base text-white p-1 rounded border border-amber-500/30"
                          />
                        </td>

                        <td className="p-2 text-center space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-400 text-base hover:scale-125 transition cursor-pointer"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-400 text-base hover:scale-125 transition cursor-pointer"
                          >
                            X
                          </button>
                        </td>
                      </>
                    ) : (
                      /* MODO NORMAL */
                      <>
                        <td className="px-4 py-3 text-white text-base">
                          {client.customer_name}
                        </td>
                        <td className="px-4 py-3 text-white text-base font-medium">
                          {client.pet_name}
                        </td>
                        <td className="px-4 py-3 text-white text-base truncate max-w-[150px]">
                          {client.address || '—'}
                        </td>
                        <td className="px-4 py-3 text-white text-base">
                          {client.number_customer || '—'}
                        </td>
                        <td className="px-4 py-3 text-white text-base">
                          {client.pet_breed || '—'}
                        </td>
                        <td className="px-4 py-3 text-white text-base">
                          {client.last_bath
                            ? formatDate(client.last_bath)
                            : 'Não registrado'}
                        </td>

                        <td className="px-4 py-3 text-white text-base">
                          {formatDate(client.created_at)}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => handleEdit(client)}
                              className="hover:scale-125 transition"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => openDeleteModal(client)}
                              className="hover:scale-125 transition"
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
          <Button onClick={() => router.push('/')}>Voltar ao início</Button>
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
