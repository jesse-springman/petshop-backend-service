import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import ClientsList from '@/components/ClientList';

//mock do useUser simulando alguém logado
jest.mock('../context/UserContext', () => ({
  useUser: () => ({
    userName: 'jesse',
    isAdmin: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

//Mock para simular o PATCH
global.fetch = jest.fn();

const mockClients = [
  {
    id: '1',
    customer_name: 'Jesse',
    pet_name: 'Cacau',
    created_at: '2025-08-30T14:48:03.026Z',
  },
  {
    id: '2',
    customer_name: 'Gabi',
    pet_name: 'sky',
    created_at: '2025-08-31T10:20:00.000Z',
  },
];

describe('Edit Inline in table Customers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockClients,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Must show button "Editar" in each line', async () => {
    render(<ClientsList />);

    await screen.findByText('Jesse'); //espera a tabela carregar

    const editBtns = screen.getAllByRole('button', { name: /editar/i });

    expect(editBtns).toHaveLength(2);
  });

  it('Must go into mode edition when click in "Editar', async () => {
    render(<ClientsList />);
    await screen.findByText('Jesse');

    const editBtn = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editBtn[0]);

    //verifica se os campos habilitaram
    expect(screen.getByDisplayValue('Jesse')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Cacau')).toBeInTheDocument();

    //verifica se os botões Salvar e Cancelar apareceram
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should allow edit in fields and save data', async () => {
    render(<ClientsList />);

    await screen.findByText('Jesse');

    const editBtns = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editBtns[0]);

    const inputName = screen.getByDisplayValue('Jesse');
    const inputPet = screen.getByDisplayValue('Cacau');

    //Valores novos
    fireEvent.change(inputName, { target: { value: 'New-Jesse' } });
    fireEvent.change(inputPet, { target: { value: 'New-Cacau' } });

    //clica em salvar as os valores novos
    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.getByText('New-Jesse')).toBeInTheDocument;
      expect(screen.getByText('New-Cacau')).toBeInTheDocument;
    });

    //verifica se depois que salvou voltou o normal
    expect(screen.getAllByRole('button', { name: /editar/i })).toHaveLength(2);
  });

  it('Must cancel the edtion e back original state', async () => {
    render(<ClientsList />);

    await screen.findByText('Jesse');

    const editBtn = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editBtn[0]);

    const inputName = screen.getByDisplayValue('Jesse');
    fireEvent.change(inputName, { target: { value: 'nome que vai salvar' } });

    fireEvent.click(screen.getByText('Cancelar'));

    await waitFor(() => {
      expect(screen.getByText('Jesse')).toBeInTheDocument;
      expect(
        screen.queryByDisplayValue('nome que vai salvar'),
      ).not.toBeInTheDocument();
    });
  });
});
