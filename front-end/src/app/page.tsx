'use client';

import Button from '@/components/Button';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next//navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { userName, login, isAdmin } = useUser();
  const [inputName, setInputName] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      login(inputName.trim());
      router.push('/clientes');
    }
  };

  useEffect(() => {
    // Se já logado, redireciona
    if (userName) {
      router.push('/clientes');
    }
  }, [userName, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from[#0B0E11] to-[#1A1D22] flex flex-col items-center justify-center p-4 md:p-8">
      <section className="relative z-10 m-w-5x1 mx-auto flex-flex-col md:flex-row text-center items-center justify-between gap-8">
        <div className="flex-shrink-0 w-full md:w-auto">
          <img
            className="w-full max-w-lg md:max-w-xl rounded-3xl max-w-2xl rounded-2x1 h-auto max-h-180 md:max-h-screen/2 lg:max-h-screen/2  shadow-2xl border border-amber-500/30 object-cover"
            src="/pit.png"
            alt="Pitbull cibernético"
          />
        </div>

        <div className="py-10 text-center  space-y-6">
          <div className="bg-black w-100% h-100% p-5 rounded-3xl shadow-2xl border border-amber-500/30">
            <h1 className="text-2x1 md:text-6xl font-bold text-amber-400 tracking-wide">
              New-Pettz
            </h1>
          </div>

          <p className="text-lg md:text-xl text-gray-300 max-w-lg">
            Seu petshop moderno e confiável. Cadastre clientes, gerencie
            atendimentos e cuide dos seus pets com tecnologia de ponta.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className={typeof window !== 'undefined' && isAdmin ? '' : 'hidden'}
          >
            <Button onClick={() => router.push('/cadastro')}>Cadastro</Button>
          </div>

          <Button onClick={() => router.push('/clientes')}>
            Clientes Cadastrados
          </Button>
        </div>
      </section>

      <div className="bg-[#1A1D22] p-10 rounded-2xl shadow-2xl border border-amber-500/20 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-amber-400 mb-8">
          Admin Petshop
        </h1>

        <p className="text-gray-300 mb-8"> Código do Gerente</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="password"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Ex: Código do Gerente"
            required
            className="w-full px-6 py-4 text-lg bg-[#0B0E11] text-white rounded-xl border border-amber-500/30 focus:border-amber-400 focus:outline-none"
            autoFocus
          />

          <button
            type="submit"
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg rounded-xl transition"
          >
            Entrar
          </button>
        </form>
      </div>

      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        © 2025 New-Pettz. Todos os direitos reservados.
      </footer>
    </main>
  );
}
