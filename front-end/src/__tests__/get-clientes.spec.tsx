import { render, screen, waitFor } from "@testing-library/react";
import ClientsList from "../components/ClientList";
import userEvent from "@testing-library/user-event";
import { getClients } from "../services/customer/get";

jest.mock("../context/UserContext", () => ({
  useUser: () => ({
    userName: "jesse",
    isAdmin: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock("../services/customer/get", () => ({
  getClients: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockClients = [
  {
    id: "1",
    customer_name: "jesse",
    pet_name: "cacau",
    created_at: "2025-12-30T14:48:03.026Z",
    address: "Rua mario azevedo n=14",
    number_customer: "19983350238",
    pet_beed: "vira-lata",
    last_bath: "2026-02-02T21:31:18.551Z",
  },
  {
    id: "2",
    customer_name: "maria",
    pet_name: "bolinha",
    created_at: "2025-12-31T10:20:00.000Z",
    address: "av luis-15 n=134",
    number_customer: "19993451232",
    pet_breed: "vira-lata",
    last_bath: "2026-01-28T21:31:18.551Z",
  },
  {
    id: "3",
    customer_name: "carlos",
    pet_name: "boli",
    created_at: "2025-12-31T10:20:00.000Z",
    address: "av luis-15 n=134",
    number_customer: "19993451232",
    pet_breed: "vira-lata",
    last_bath: "2026-01-28T21:31:18.551Z",
  },
];

describe("GET /clientes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show o state loading initial", () => {
    (getClients as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<ClientsList />);

    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  });

  it("should show all customers", async () => {
    (getClients as jest.Mock).mockResolvedValue(mockClients);

    render(<ClientsList />);

    await waitFor(() => expect(screen.getByText("jesse")).toBeInTheDocument());

    expect(screen.getByText("jesse")).toBeInTheDocument();
    expect(screen.getByText("cacau")).toBeInTheDocument();
    expect(screen.getByText("maria")).toBeInTheDocument();
    expect(screen.getByText("bolinha")).toBeInTheDocument();

    // Ajuste a data conforme o seu formatDate (exemplo pt-BR)
    expect(screen.getAllByText(/30\/12\/2025/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/31\/12\/2025/i)[0]).toBeInTheDocument();
  });

  it("erro case when API failure", async () => {
    (getClients as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<ClientsList />);

    expect(await screen.findByText(/Não foi possível localizar os clientes/i)).toBeInTheDocument();
  });

  it('should have button "Voltar ao início"', async () => {
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    render(<ClientsList />);

    const button = await screen.findByRole("button", {
      name: /voltar ao início/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("it should filter customers when to type the customer name in search", async () => {
    const user = userEvent.setup();

    (getClients as jest.Mock).mockResolvedValue(mockClients);

    render(<ClientsList />);

    // espera os dados carregarem
    await screen.findByText("jesse");
    await screen.findByText("maria");

    const input = screen.getByPlaceholderText("Digite o nome do cliente...");
    await user.type(input, "jesse");

    await waitFor(() => {
      expect(screen.queryByText("maria")).not.toBeInTheDocument();
      expect(screen.getByText("jesse")).toBeInTheDocument();
    });
  });

  it("it should retorn a message not found", async () => {
    const user = userEvent.setup();
    (getClients as jest.Mock).mockResolvedValue(mockClients);

    render(<ClientsList />);

    await screen.findByText("jesse");

    const input = screen.getByPlaceholderText("Digite o nome do cliente...");
    await user.type(input, "tia12");

    await waitFor(() => {
      expect(screen.getByText("Nenhum cliente encontrado com esse nome")).toBeInTheDocument();
    });
  });
});

it("it should retorn customer with Case-Insensitive", async () => {
  const user = userEvent.setup();
  (getClients as jest.Mock).mockResolvedValue(mockClients);

  render(<ClientsList />);

  await screen.findByText(/jesse/i);

  const input = screen.getByPlaceholderText("Digite o nome do cliente...");
  await user.type(input, "jesse");

  await waitFor(() => {
    expect(screen.getByText(/jesse/i)).toBeInTheDocument();
  });
});

it("it should retorn customer with words partial", async () => {
  const user = userEvent.setup();

  (getClients as jest.Mock).mockResolvedValue(mockClients);
  render(<ClientsList />);

  await screen.findByText("carlos");

  const input = screen.getByPlaceholderText("Digite o nome do cliente...");
  await user.type(input, "car");

  await waitFor(() => {
    expect(screen.getByText("carlos")).toBeInTheDocument();
  });
});

it("it should retorn all customer when clear the input", async () => {
  const user = userEvent.setup();

  (getClients as jest.Mock).mockResolvedValue(mockClients);

  render(<ClientsList />);

  await screen.findByText("carlos");
  await screen.findByText("maria");

  const input = screen.getByPlaceholderText("Digite o nome do cliente...");
  await user.type(input, "carlos");
  await user.clear(input);

  expect(getClients).toHaveBeenCalled();

  await waitFor(() => {
    expect(screen.getAllByText("carlos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("maria").length).toBeGreaterThan(0);
  });
});
