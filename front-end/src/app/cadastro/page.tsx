'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function FormCadastro() {
  const [nameClient, setNameClient] = useState('');
  const [namePet, setNamePet] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const handleSubimit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameClient || !namePet) {
      setMessage('Preencha todos os campos!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${apiBase}/cadastro`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },

        body: JSON.stringify({
          customer_name: nameClient,
          pet_name: namePet,
        }),
      });

      if (response.status === 201) {
        setMessage('Cadastro realizado com sucesso!');
        setNameClient('');
        setNamePet('');
        setTimeout(() => router.push('/'), 7000);
      } else {
        setMessage('Erro ao cadastrar. Tente novamente.');
      }
    } catch (error) {
      setMessage('Erro na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex items-center justify-center p-4">
      <div className="bg-[#1A1D22] p-8 md:p-12 rounded-2xl shadow-2xl border border-amber-500/20 max-w-md w-full">
        <h1 className="text-4xl font-bold text-amber-400 text-center mb-8">
          Cadastro de Cliente
        </h1>

        <form onSubmit={handleSubimit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 text-lg">
              Nome do Cliente
            </label>

            <input
              type="text"
              value={nameClient}
              onChange={(e) => setNameClient(e.target.value)}
              className="w-full px-4 py-3  bg-[#0B0E11]  border border-gray-700 rounded-lg tetx-white focus:outline-none focus:border-amber-500 transtion"
              placeholder="Ex: Pedro"
              disabled={loading}
            />

            <label className="block mt-5 text-gray-300 mb-2 text-lg">
              Nome do Pet
            </label>

            <input
              type="text"
              value={namePet}
              onChange={(e) => setNamePet(e.target.value)}
              className="w-full px-4 py-3  bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transation"
              placeholder="Ex: Tobby"
              disabled={loading}
            />
          </div>

          {message && (
            <p
              className={`text-center text-lg ${
                message.includes('sucesso') ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Cadastrando' : 'Cadastrar'}
          </Button>
        </form>

        <Button onClick={() => router.push('/')}>← Voltar para início</Button>
      </div>
    </main>
  );
}
