import { render, screen, waitFor } from '@testing-library/react';
import ClientsList from '../components/ClientList';

jest.mock('../context/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
  useUser: () => ({
    userName: 'jesse',
    isAdmin: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock correto do useRouter (corrigindo o typo "navegation" → "navigation")
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

global.fetch = jest.fn();

describe('GET /clientes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show o state loading initial', () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {})); // loading infinito

    render(<ClientsList />);

    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  });

  it('should show message when there are no registered customers', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<ClientsList />);

    expect(
      await screen.findByText(/Nenhum cliente cadastrado ainda/i),
    ).toBeInTheDocument();
  });

  it('should show all customers', async () => {
    const mockClients = [
      {
        id: '1',
        customer_name: 'Jesse',
        pet_name: 'Cacau',
        created_at: '2025-12-30T14:48:03.026Z',
      },
      {
        id: '2',
        customer_name: 'Maria',
        pet_name: 'Bolinha',
        created_at: '2025-12-31T10:20:00.000Z',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockClients,
    });

    render(<ClientsList />);

    await waitFor(() => expect(screen.getByText('Jesse')).toBeInTheDocument());

    expect(screen.getByText('Jesse')).toBeInTheDocument();
    expect(screen.getByText('Cacau')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('Bolinha')).toBeInTheDocument();

    // Ajuste a data conforme o seu formatDate (exemplo pt-BR)
    expect(screen.getByText(/30\/12\/2025/i)).toBeInTheDocument();
    expect(screen.getByText(/31\/12\/2025/i)).toBeInTheDocument();
  });

  it('erro case when API failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ClientsList />);

    expect(
      await screen.findByText(/Não foi possível localizar os clientes/i),
    ).toBeInTheDocument();
  });

  it('should have button "Voltar ao início"', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<ClientsList />);

    const button = await screen.findByRole('button', {
      name: /voltar ao inicio/i,
    });
    expect(button).toBeInTheDocument();
  });
});
