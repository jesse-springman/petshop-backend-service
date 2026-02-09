import { render, screen, waitFor } from '@testing-library/react';
import ClientsList from '../components/ClientList';
import userEvent from '@testing-library/user-event';

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

describe('GET /clientes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock) = jest.fn();
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

  it('it should filter customers when to type the customer name in search', async () => {
    const user = userEvent.setup();

    const mockClients = [
      {
        id: '1',
        customer_name: 'Jessezin',
        pet_name: 'tete',
        created_at: '2025-12-30T14:48:03.026Z',
        address: 'Rua A',
        number_customer: '123',
        pet_breed: 'vira-lata',
        last_bath: '2026-02-02T21:31:18.551Z',
      },
      {
        id: '2',
        customer_name: 'claudia',
        pet_name: 'zeze',
        created_at: '2025-12-31T10:20:00.000Z',
        address: 'Rua B',
        number_customer: '456',
        pet_breed: 'poodle',
        last_bath: '2026-01-28T21:31:18.551Z',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockClients,
    });

    render(<ClientsList />);

    // espera os dados carregarem
    await screen.findByText('Jessezin');
    await screen.findByText('claudia');

    const input = screen.getByPlaceholderText('Digite o nome do cliente...');
    await user.type(input, 'Jessezin');

    await waitFor(() => {
      expect(screen.queryByText('Maria')).not.toBeInTheDocument();
      expect(screen.getByText('Jessezin')).toBeInTheDocument();
    });
  });

  it('it should retorn a message not found', async () => {
    const user = userEvent.setup();

    const mockClients = [
      {
        id: '1',
        customer_name: 'Jessezin',
        pet_name: 'tete',
        created_at: '2025-12-30T14:48:03.026Z',
        address: 'Rua A',
        number_customer: '123',
        pet_breed: 'vira-lata',
        last_bath: '2026-02-02T21:31:18.551Z',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockClients,
    });

    render(<ClientsList />);

    await screen.findByText('Jessezin');

    const input = screen.getByPlaceholderText('Digite o nome do cliente...');
    await user.type(input, 'tia12');

    await waitFor(() => {
      expect(
        screen.getByText('Nenhum cliente encontrado com esse nome'),
      ).toBeInTheDocument();
    });
  });
});

it('it should retorn customer with Case-Insensitive', async () => {
  const user = userEvent.setup();

  const mockClients = [
    {
      id: '1',
      customer_name: 'Test',
      pet_name: 'kakae',
      created_at: '2025-12-30T14:48:03.026Z',
      address: 'Rua A',
      number_customer: '123',
      pet_breed: 'vira-lata',
      last_bath: '2026-02-02T21:31:18.551Z',
    },
  ];

  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockClients,
  });

  render(<ClientsList />);

  await screen.findByText('Test');

  const input = screen.getByPlaceholderText('Digite o nome do cliente...');
  await user.type(input, 'test');

  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

it('it should retorn customer with words partial', async () => {
  const user = userEvent.setup();

  const mockClients = [
    {
      id: '1',
      customer_name: 'carlos',
      pet_name: 'kakae',
      created_at: '2025-12-30T14:48:03.026Z',
      address: 'Rua A',
      number_customer: '123',
      pet_breed: 'vira-lata',
      last_bath: '2026-02-02T21:31:18.551Z',
    },
  ];

  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockClients,
  });

  render(<ClientsList />);

  await screen.findByText('carlos');

  const input = screen.getByPlaceholderText('Digite o nome do cliente...');
  await user.type(input, 'car');

  await waitFor(() => {
    expect(screen.getByText('carlos')).toBeInTheDocument();
  });
});

it('it should retorn all customer when clear the input', async () => {
  const user = userEvent.setup();

  const mockClients = [
    {
      id: '1',
      customer_name: 'carlos',
      pet_name: 'kakae',
      created_at: '2025-12-30T14:48:03.026Z',
      address: 'Rua A',
      number_customer: '123',
      pet_breed: 'vira-lata',
      last_bath: '2026-02-02T21:31:18.551Z',
    },

    {
      id: '2',
      customer_name: 'egidio',
      pet_name: 'sasa',
      created_at: '2024-12-30T14:48:03.026Z',
      address: 'Rua b',
      number_customer: '1523',
      pet_breed: 'vira-lata',
      last_bath: '2024-02-02T21:31:18.551Z',
    },
  ];

  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockClients,
  });

  render(<ClientsList />);

  await screen.findByText('carlos');
  await screen.findByText('egidio');

  const input = screen.getByPlaceholderText('Digite o nome do cliente...');
  await user.type(input, 'carlos');
  await user.clear(input);

  await waitFor(() => {
    expect(screen.getByText('carlos')).toBeInTheDocument();
    expect(screen.getByText('egidio')).toBeInTheDocument();
  });
});
