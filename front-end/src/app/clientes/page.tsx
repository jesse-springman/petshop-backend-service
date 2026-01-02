'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

type Client = {
  id: string;
  nameClient: string;
  namePet: string;
};

export default function GetClients() {
  const [clients, setClient] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/clientes';

  useEffect(() => {
    const getDataClients = async () => {
      try {
        const response = await fetch(`${API_URL}/clientes`);

        if (!response.ok) {
          throw new Error('Erro na  busca de clientes');
        }

        const data = await response.json();
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
      <div className="bg-[#1A1D22] p-8 md:p-12 rounded-2xl shadow-2xl border border-amber-500/20 max-w-4xl w-full">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client: Client, index: number) => (
              <div
                className="bg-[#0B0E11] p-6 rounded-xl border border-amber-500/20 shadow-md hover:shadow-lg transition"
                key={client.id ?? index}
              >
                <h3 className="text-xl font-semibold text-amber-300">
                  {client.namePet}
                </h3>

                <p className="text-gray-300 mt-2">
                  Dono : <span className="text-white">{client.nameClient}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button onClick={() => router.push('/')}>Voltar ao inicio</Button>
        </div>
      </div>
    </main>
  );
}
