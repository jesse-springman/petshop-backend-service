"use client";

import Button from '@/components/Button'
import { useRouter } from 'next//navigation';

export default function HomePage() {

  const router = useRouter();

  return (
    <main className='min-h-screen bg-gradient-to-b from[#0B0E11] to-[#1A1D22] flex flex-col items-center justify-center p-4 md:p-8'>

      <section className="relative z-10 m-w-5x1 mx-auto flex-flex-col md:flex-row text-center items-center justify-between gap-8">

        <div className='flex-shrink-0 w-full md:w-auto'>
          <img className="w-full max-w-lg md:max-w-xl rounded-3xl max-w-2xl rounded-2x1 h-auto max-h-180 md:max-h-screen/2 lg:max-h-screen/2  shadow-2xl border border-amber-500/30 object-cover"
            src="/pit.png"
            alt="Pitbull cibernético" />
        </div>



        <div className='py-10 text-center  space-y-6'>
          <div className='bg-black w-100% h-100% p-5 rounded-3xl shadow-2xl border border-amber-500/30'>
              <h1 className="text-2x1 md:text-6xl font-bold text-amber-400 tracking-wide">New-Pettz</h1>
          </div>
          
           
          <p className='text-lg md:text-xl text-gray-300 max-w-lg'>
            Seu petshop moderno e confiável. Cadastre clientes, gerencie atendimentos e cuide dos seus pets com tecnologia de ponta.
          </p>
        </div>


        <div className="flex flex-col gap-4">
          <Button
            onClick={()=> router.push("/cadastro")}
          >
            Cadastro
          </Button>

          <Button
            onClick={()=> router.push('/clientes')}
          >
            Clientes Cadastrados
          </Button>
        </div>
      </section>

      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        © 2025 New-Pettz. Todos os direitos reservados.
      </footer>

    </main >
  );
}
