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
    }
  };

  useEffect(() => {
    // Se já logado, redireciona
    if (userName) {
      router.push('/clientes');
    }
  }, [userName, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1A1D22] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Fundo sutil com pitbull */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <img src="/pit.png" alt="" className="w-full h-full object-cover" />
      </div>

      {/* Conteúdo principal - grid responsivo */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl w-full items-center space-y-8 lg:space-y-20 text-center lg:text-left">
        {/* Lado esquerdo: imagem + título + descrição */}
        <div className="text-center lg:text-left space-y-8">
          <div className="mx-auto lg:mx-0 w-130">
            <img
              src="/pit.png"
              alt="New-Pettz"
              className="w-full rounded-full border-4border-amber-500/50 shadow-2xl [box-shadow:_0_0_40px_rgba(251,191,36,0.2)]"
            />
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-amber-400 tracking-wider drop-shadow-2xl [text-shadow:_0_15px_30px_rgba(0,0,0,0.9)]">
            New-Pettz
          </h1>

          <p className="mb-15 text-xl md:text-2xl text-gray-300 max-w-lg mx-auto lg:mx-0 drop-shadow-2xl [text-shadow:_0_10px_20px_rgba(0,0,0,0.9),_0_0_40px_rgba(0,0,0,0.7)]">
            Seu petshop moderno e confiável. Cadastre clientes, gerencie
            atendimentos e cuide dos seus pets com tecnologia de ponta.
          </p>

          {/* Botões principais */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <Button onClick={() => router.push('/cadastro')}>
              Cadastro de Clientes
            </Button>
            <Button onClick={() => router.push('/clientes')}>
              Ver Clientes
            </Button>
          </div>
        </div>

        {/* Lado direito: card de login admin */}
        <div className="justify-self-center lg:justify-self-end">
          <div className="bg-[#1A1D22]/90 backdrop-blur-lg p-12 rounded-3xl shadow-2xl borderborder-amber-500/50 shadow-2xl [box-shadow:_0_0_40px_rgba(251,191,36,0.2)]">
            <h2 className="text-4xl font-bold text-amber-400 mb-8 text-center">
              Acesso Admin
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Digite seu nome"
                required
                className="w-full px-8 py-5 text-lg bg-[#0B0E11] text-white rounded-2xl border border-amber-500/40 focus:border-amber-400 focus:outline-none transition"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xl rounded-2xl transition duration-300 shadow-lg"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 text-center text-gray-500 text-sm w-full">
        © 2025 New-Pettz. Todos os direitos reservados.
      </footer>
    </main>
  );
}
