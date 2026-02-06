import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import toast, { Toaster } from 'react-hot-toast';
import ClientsList from '../components/ClientList';

// Mock toast
jest.mock('react-hot-toast', () => {
  return {
    __esModule: true,
    default: {
      success: jest.fn(),
      error: jest.fn(),
    },
    Toaster: () => <div data-testid="toaster" />,
  };
});

// Mock UserContext
jest.mock('../context/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
  useUser: () => ({
    userName: 'jesse',
    isAdmin: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('DELETE client', () => {
  const mockClients = [
    {
      id: '1',
      customer_name: 'João',
      pet_name: 'Rex',
      created_at: '2025-08-30T14:48:03.026Z',
      address: 'av luis-15 n=134',
      number_customer: '19993451232',
      pet_beed: 'vira-lata',
      last_bath: '2026-01-28T21:31:18.551Z',
    },
    {
      id: '2',
      customer_name: 'Maria',
      pet_name: 'Luna',
      created_at: '2025-08-31T10:20:00.000Z',
      address: 'Rua mario azevedo n=14',
      number_customer: '19983350238',
      pet_beed: 'vira-lata',
      last_bath: '2026-02-02T21:31:18.551Z',
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();

    global.fetch = jest
      .fn()
      // GET inicial
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockClients,
      })
      // DELETE
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      // GET após delete
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockClients[1]],
      });
  });

  it('Must open confirmation modal when clicking delete', async () => {
    render(<ClientsList />);

    const joao = await screen.findByText('João');
    const row = joao.closest('tr')!;
    const deleteButton = within(row).getByLabelText('Excluir');

    fireEvent.click(deleteButton);

    expect(
      screen.getByRole('heading', { name: /confirmar exclusão/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Excluir cliente João e o pet Rex?/i),
    ).toBeInTheDocument();
  });

  it('Must delete the client when confirming success', async () => {
    render(
      <>
        <ClientsList />
        <Toaster />
      </>,
    );

    const joao = await screen.findByText('João');
    const row = joao.closest('tr')!;
    fireEvent.click(within(row).getByLabelText('Excluir'));

    const modal = await screen.findByRole('dialog');
    const confirmButton = within(modal).getByRole('button', {
      name: 'Excluir',
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Cliente excluído com sucesso',
      );
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/clientes/1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('Must show error when DELETE fails', async () => {
    (global.fetch as jest.Mock).mockReset();

    global.fetch = jest
      .fn()
      // GET inicial
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockClients,
      })
      // DELETE com erro
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'cliente não encontrado' }),
      })
      // GET novamente (lista intacta)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockClients,
      });

    render(
      <>
        <ClientsList />
        <Toaster />
      </>,
    );

    const joao = await screen.findByText('João');
    const row = joao.closest('tr')!;
    fireEvent.click(within(row).getByLabelText('Excluir'));

    const modal = await screen.findByRole('dialog');
    fireEvent.click(within(modal).getByRole('button', { name: 'Excluir' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao excluir cliente');
    });

    // Cliente continua na tela
    expect(screen.getByText('João')).toBeInTheDocument();
  });
});
