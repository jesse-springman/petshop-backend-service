# New-Pettz 🐶✨

**Seu petshop moderno e confiável**, agora com tecnologia de ponta!

New-Pettz é um sistema de gerenciamento simples e elegante para petshops. Permite cadastrar clientes e pets, listar todos os registros e editar informações diretamente na tabela — tudo com uma interface dark futurista inspirada em cyberpunk.

<img src="/images/pithome.png" alt="Pitbull ciborgue"/>

_(Captura da tela inicial com o pitbull ciborgue e layout responsivo)_

## 🚀 Funcionalidades

- **Cadastro de clientes** — Nome do dono e nome do pet
- **Listagem completa** — Tabela responsiva com todos os clientes cadastrados
- **Edição inline** — Clique em "Editar" e altere os dados diretamente na linha
- **Autenticação simples** — Login por nome (multi-usuário básico)
- **Design responsivo** — Funciona perfeitamente em desktop e mobile
- **Testes automatizados** — Cobertura com Jest + React Testing Library (edição, listagem, validações)

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Estilização**: Tailwind CSS
- **Testes**: Jest + React Testing Library
- **Estado global**: React Context
- **Backend**: Node.js simples (localhost:3001) — apenas para armazenar dados (pode ser substituído por qualquer API)

## 📦 Como Rodar o Projeto

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório

   ```bash
   git clone https://github.com/seu-usuario/new-pettz.git
   cd new-pettz
   ```

   2.Instale as dependências do fronten

   ```bash
   cd front-end
   npm install
   ```

   3.Rode o backend (em outro terminal)

   ```bash
   cd ../back-end
   npm install
   npm star
   ```

   O servidor vai rodar em http://localhost:3001

4.Rode o frontend

```bash
cd ../front-end
npm run dev
```

5.Acesse no navegador: http://localhost:3000

Testes O projeto possui testes automatizados para:Validação de campos no cadastro
Listagem de clientes (loading, vazio, com dados, erro)
Edição inline na tabela

Para rodar os testes:

```bash
npm test
```
