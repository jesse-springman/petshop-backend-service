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

  it('should show all customers', async () => {
    const mockClients = [
      {
        id: '1',
        customer_name: 'Jesse',
        pet_name: 'Cacau',
        created_at: '2025-12-30T14:48:03.026Z',
        address: 'Rua mario azevedo n=14',
        number_customer: '19983350238',
        pet_beed: 'vira-lata',
        last_bath: '2026-02-02T21:31:18.551Z',
      },
      {
        id: '2',
        customer_name: 'Maria',
        pet_name: 'Bolinha',
        created_at: '2025-12-31T10:20:00.000Z',
        address: 'av luis-15 n=134',
        number_customer: '19993451232',
        pet_beed: 'vira-lata',
        last_bath: '2026-01-28T21:31:18.551Z',
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
      name: /voltar ao início/i,
    });
    expect(button).toBeInTheDocument();
  });
});
