'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function FormCadastro() {
  const [nameClient, setNameClient] = useState('');
  const [namePet, setNamePet] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [racaPet, setRacaPet] = useState('');
  const [lastBath, setLastBath] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [numberCustomer, setNumberCustomer] = useState('');
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
          pet_breed: racaPet,
          number_customer: numberCustomer,
          last_bath: lastBath,
          address,
        }),
      });

      if (response.status === 201) {
        setMessage('Cadastro realizado com sucesso!');
        setNameClient('');
        setNamePet('');
        setAddress('');
        setNumberCustomer('');
        setRacaPet('');
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
      <div className="bg-[#1A1D22] p-6 md:p-10 rounded-2xl shadow-2xl [box-shadow:_0_0_40px_rgba(251,191,36,0.2)] border-amber-500/20  max-w-lg w-auto">
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
              className="w-full px-4 py-3  bg-[#0B0E11]  border border-gray-700 rounded-lg tetx-white focus:outline-none focus:border-amber-500 transtion mb-4"
              placeholder="Ex: Pedro"
              disabled={loading}
            />

            <label className="block text-gray-300 mb-2 text-lg">
              Número do Cliente
            </label>

            <input
              className="w-full px-4 py-3 bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition mb-4"
              type="tel"
              value={numberCustomer}
              onChange={(e) => setNumberCustomer(e.target.value)}
              placeholder="(xx) xxxx-xxxx"
              disabled={loading}
            />

            <label className="block text-gray-300 mb-2 text-lg">
              Endereço do Cliente
            </label>

            <input
              className="w-full px-4 py-3 bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av Brasil"
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

            <label className="block mt-5 text-gray-300 mb-2 text-lg">
              Raça do Pet
            </label>

            <input
              className="w-full px-4 py-3  bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transation"
              type="text"
              value={racaPet}
              onChange={(e) => setRacaPet(e.target.value)}
              placeholder="Pit-Bull"
              disabled={loading}
            />

            <label className="block mt-5 text-gray-300 mb-2 text-lg">
              Data do Último banho :
            </label>

            <input
              className="w-full px-4 py-3 bg-[#0B0E11] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition"
              type="date"
              value={lastBath}
              onChange={(e) => setLastBath(e.target.value)}
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
