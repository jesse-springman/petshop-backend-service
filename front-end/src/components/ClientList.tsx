'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { useUser } from '@/context/UserContext';

type Client = {
  id: string;
  customer_name: string;
  pet_name: string;
  created_at: string;
  isAdmin: string;
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

const admin = process.env.ADMINS;

export default function ClientsList() {
  const [clients, setClient] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editForm, setEditForm] = useState({ customer_name: '', pet_name: '' });
  const router = useRouter();
  const { login, userName, logout, isAdmin } = useUser();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  function handleEdit(client: Client) {
    setEditClient(client);
    setEditForm({
      customer_name: client.customer_name,
      pet_name: client.pet_name,
    });
  }

  const handleCancel = () => {
    setEditClient(null);
    setEditForm({ customer_name: '', pet_name: '' });
  };

  const handleSave = async () => {
    if (!editClient) return;

    try {
      const response = await fetch(`${API_URL}/clientes/${editClient.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setClient(
          clients.map((c) =>
            c.id === editClient.id ? { ...c, ...editForm } : c,
          ),
        );
        handleCancel();
      } else {
        alert('Erro em atualizar');
      }
    } catch (error) {
      alert('Erro de conexão');
    }
  };

  useEffect(() => {
    const getDataClients = async () => {
      try {
        const response = await fetch(`${API_URL}/clientes`);

        if (!response.ok) {
          throw new Error('Erro na  busca de clientes');
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);
        setClient(data);
      } catch (error) {
        console.error('Erro fetch:', error);
        setErro(
          'Não foi possível localizar os clientes, por favor tente novamente mais tarde.',
        );
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getDataClients();
  }, []);

  //const allClients = clients.filter((client) => client.isAdmin === admin);

  const allClients = clients;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex items-center justify-center p-4">
      <div className="bg-[#1A1D22] p-8 md:p-12 rounded-2xl border-4border-amber-500/50 shadow-2xl [box-shadow:_0_0_40px_rgba(251,191,36,0.2)] max-w-9/12 w-full">
        <div>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="text-red-500 hover:text-red-300 font-medium"
          >
            Sair
          </button>
        </div>
        <h1 className="text-4xl front-bold text-amber-400 text-center mb-8">
          Clientes Cadastrados
        </h1>

        {loading && (
          <p className="text-center text-gray-400 text-xl">Carregando...</p>
        )}

        {erro && <p className="text-center text-red-500 text-lg">{erro}</p>}

        {!loading && !erro && clients.length === 0 && (
          <p className="text-center text-gray-400 text-xl">
            Nenhum cliente cadastrado ainda
          </p>
        )}

        {!loading && !erro && clients.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed min-w-full divide-y divide-amber-500 shadow-2xl border border-amber-500/20">
              <thead className="bg-[#0B0E11] ">
                <tr>
                  <th className="w-1/3 px-6 py-4 text-left text-sm text-xl text-amber-300 uppercase tracking-wider">
                    Nome do Dono
                  </th>
                  <th className="w-1/3 px-6 py-4 text-left text-sm text-xl text-amber-300 uppercase tracking-wider">
                    Pet
                  </th>
                  <th className="w-1/6 px-6 py-4 text-left text-sm text-xl text-amber-300 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="w-1/6 px-6 py-4 text-center text-sm text-xl text-amber-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="bg-[#0B0E11] divide-y divide-amber-500/20">
                {allClients.map((client: Client, index: number) => (
                  <tr
                    key={client.id || index}
                    className="hover:bg-amber-500/5 transition duration-200"
                  >
                    {editClient?.id === client.id ? (
                      // MODO EDIÇÃO
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.customer_name}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                customer_name: e.target.value,
                              })
                            }
                            className="w-full bg-[#1A1D22] text-white px-3 py-2 rounded border border-amber-500/50 focus:border-amber-400 focus:outline-none"
                            autoFocus
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.pet_name}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                pet_name: e.target.value,
                              })
                            }
                            className="w-full bg-[#1A1D22] text-white px-3 py-2 rounded border border-amber-500/50 focus:border-amber-400 focus:outline-none"
                          />
                        </td>
                        <td className="px-6 py-4 text-white text-sm">
                          {formatDate(client.created_at)}
                        </td>
                        <td className="px-6 py-4 text-center space-x-4">
                          <button
                            onClick={handleSave}
                            className="text-green-400 hover:text-green-300 font-medium cursor-pointer"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-400 hover:text-red-300 font-medium cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      // MODO NORMAL
                      <>
                        <td className="px-6 py-4 text-white truncate">
                          {client.customer_name}
                        </td>
                        <td className="px-6 py-4 text-white truncate">
                          {client.pet_name}
                        </td>
                        <td className="px-6 py-4 text-white text-sm">
                          {formatDate(client.created_at)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEdit(client)}
                            className="text-amber-400 hover:text-amber-200 font-medium transition cursor-pointer"
                          >
                            Editar ✏️
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 text-center">
          <Button onClick={() => router.push('/')}>Voltar ao inicio</Button>
        </div>
      </div>
    </main>
  );
}
