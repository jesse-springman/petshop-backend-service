'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { log } from 'console';

type Client = {
  id: string;
  customer_name: string;
  pet_name: string;
  created_at: string;
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

export default function GetClients() {
  const [clients, setClient] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const getDataClients = async () => {
      try {
        const response = await fetch(`${API_URL}/clientes`);

        if (!response.ok) {
          throw new Error('Erro na  busca de clientes');
        }

        const data = await response.json();
        console.log(data);
        setClient(data);
      } catch (error) {
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex items-center justify-center p-4">
      <div className="bg-[#1A1D22] p-8 md:p-12 rounded-2xl shadow-2xl border border-amber-500/20 max-w-9/12 w-full">
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
              <thead className="bg-[#0B0E11]">
                <tr>
                  <th className="w-2/5 px-6 py-4 text-left text-sm text-xl text-amber-300 uppercase tracking-wider">
                    Nome do Dono
                  </th>

                  <th className="w-2/5 px-6 py-4 text-left text-sm text-xl text-amber-300 uppercase tracking-wider">
                    Pet
                  </th>
                  <th className="w-1/5 px-6 py-4 text-left text-sm text-xl text-amber-300 uppercase tracking-wider">
                    Criado em
                  </th>
                </tr>
              </thead>

              <tbody className='bg-[#0B0E11] divide-y divide-amber-500/20"'>
                {clients.map((client: Client, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-amber-500/5 transition duration-200"
                  >
                    <td className="px-6 py-4 text-white truncate">
                      {client.customer_name}
                    </td>

                    <td className="px-6 py-4 text-white truncate">
                      {client.pet_name}
                    </td>

                    <td className="px-6 py-4 text-white text-sm">
                      {formatDate(client.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {clients.length === 0 && (
              <p className="text-center py-10 text-gray-400">
                Nenhum cliente cadastrado até o momento
              </p>
            )}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button onClick={() => router.push('/')}>Voltar ao inicio</Button>
        </div>
      </div>
    </main>
  );
}
