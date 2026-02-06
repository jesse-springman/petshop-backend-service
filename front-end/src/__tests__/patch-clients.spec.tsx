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
    address: 'av luis-15 n=134',
    number_customer: '19993451232',
    pet_breed: 'vira-lata',
    last_bath: '2026-01-28T21:31:18.551Z',
  },
  {
    id: '2',
    customer_name: 'Gabi',
    pet_name: 'sky',
    created_at: '2025-08-31T10:20:00.000Z',
    address: 'Rua mario azevedo n=14',
    number_customer: '19983350238',
    pet_breed: 'vira-lata',
    last_bath: '2026-02-02T21:31:18.551Z',
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
    screen.debug();
    const editBtn = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editBtn[0]);

    //verifica se os campos habilitaram
    expect(screen.getByDisplayValue('Jesse')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Cacau')).toBeInTheDocument();
    expect(screen.getByDisplayValue('av luis-15 n=134')).toBeInTheDocument();
    expect(screen.getByDisplayValue('19993451232')).toBeInTheDocument();
    expect(screen.getByDisplayValue('vira-lata')).toBeInTheDocument();
    expect(screen.getByLabelText(/último banho/i)).toBeInTheDocument();

    //verifica se os botões Salvar e Cancelar apareceram
    expect(screen.getByLabelText('Salvar')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancelar')).toBeInTheDocument();
  });

  it('should allow edit in fields and save data', async () => {
    render(<ClientsList />);

    await screen.findByText('Jesse');

    const editBtns = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editBtns[0]);

    const inputName = screen.getByDisplayValue('Jesse');
    const inputPet = screen.getByDisplayValue('Cacau');
    const inputAddress = screen.getByDisplayValue('av luis-15 n=134');
    const inputNumberCustomer = screen.getByDisplayValue('19993451232');
    const inputPetBreed = screen.getByDisplayValue('vira-lata');
    const inputLastBath = screen.getByLabelText(/último banho/i);

    //Valores novos
    fireEvent.change(inputName, { target: { value: 'New-Jesse' } });
    fireEvent.change(inputPet, { target: { value: 'New-Cacau' } });
    fireEvent.change(inputAddress, { target: { value: 'New Address' } });
    fireEvent.change(inputNumberCustomer, { target: { value: '19988888888' } });
    fireEvent.change(inputPetBreed, { target: { value: 'pitbull' } });
    fireEvent.change(inputLastBath, {
      target: { value: '01/01/2025, 11:48' },
    });

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.getByText('New-Jesse')).toBeInTheDocument;
      expect(screen.getByText('New-Cacau')).toBeInTheDocument;
    });

    //verifica se depois que salvou voltou o normal
    expect(screen.getAllByRole('button', { name: /editar/i })).toHaveLength(2);
  });

  it('Must cancel the edtion and back original state', async () => {
    render(<ClientsList />);

    await screen.findByText('Jesse');

    const editBtn = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editBtn[0]);

    const inputName = screen.getByDisplayValue('Jesse');
    fireEvent.change(inputName, { target: { value: 'nome que vai salvar' } });

    fireEvent.click(screen.getByLabelText('Cancelar'));

    await waitFor(() => {
      expect(screen.getByText('Jesse')).toBeInTheDocument;
      expect(
        screen.queryByDisplayValue('nome que vai salvar'),
      ).not.toBeInTheDocument();
    });
  });
});
