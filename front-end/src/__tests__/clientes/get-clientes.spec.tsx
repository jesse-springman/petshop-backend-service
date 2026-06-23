import { render, screen, waitFor } from "@testing-library/react";
import ClientsList from "../../components/ClientList";
import userEvent from "@testing-library/user-event";
import { getClients } from "../../services/customer/get";
import { mockClients } from "../__mocks__/cliente/list-clientes";
import { mockUserContext } from "../__mocks__/userContext";

jest.mock("@/context/UserContext", () => ({
  useUser: () => mockUserContext,
}));

jest.mock("../../context/UserContext", () => ({
  useUser: () => ({
    userName: "jesse",
    isAdmin: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock("../../services/customer/get", () => ({
  getClients: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("GET /clientes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show o state loading initial", () => {
    (getClients as jest.Mock).mockReturnValue(new Promise(() => {}));
    mockUserContext.commerce = "PETSHOP";
    render(<ClientsList />);

    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  });

  it("should show all customers", async () => {
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    mockUserContext.commerce = "PETSHOP";
    render(<ClientsList />);

    await waitFor(() => expect(screen.getByText(/jesse/i)).toBeInTheDocument());

    expect(screen.getByText(/jesse/i)).toBeInTheDocument();
    expect(screen.getByText(/maria/i)).toBeInTheDocument();

    // Ajuste a data conforme o seu formatDate (exemplo pt-BR)
    expect(screen.getAllByText(/30\/12\/2025/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/31\/12\/2025/i)[0]).toBeInTheDocument();
  });

  it("erro case when API failure", async () => {
    (getClients as jest.Mock).mockRejectedValue(new Error("Network error"));
    mockUserContext.commerce = "PETSHOP";
    render(<ClientsList />);

    expect(await screen.findByText(/Não foi possível localizar os clientes/i)).toBeInTheDocument();
  });

  it('should have button "Voltar ao início"', async () => {
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    mockUserContext.commerce = "PETSHOP";
    render(<ClientsList />);

    const button = await screen.findByRole("button", {
      name: /voltar ao início/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("it should filter customers when to type the customer name in search", async () => {
    const user = userEvent.setup();

    (getClients as jest.Mock).mockResolvedValue(mockClients);
    mockUserContext.commerce = "PETSHOP";
    render(<ClientsList />);

    // espera os dados carregarem
    await screen.findByText(/jesse/i);
    await screen.findByText(/maria/i);

    const input = screen.getByPlaceholderText("Buscar por nome...");
    await user.type(input, "Jesse");

    await waitFor(() => {
      expect(screen.queryByText(/maria/i)).not.toBeInTheDocument();
      expect(screen.getByText(/jesse/i)).toBeInTheDocument();
    });
  });

  it("it should return a message not found", async () => {
    const user = userEvent.setup();
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    mockUserContext.commerce = "PETSHOP";
    render(<ClientsList />);

    await screen.findByText(/jesse/i);

    const input = screen.getByPlaceholderText("Buscar por nome...");
    await user.type(input, "tia12");

    await waitFor(() => {
      expect(screen.getByText("Nenhum cliente encontrado")).toBeInTheDocument();
    });
  });
});

it("it should retorn customer with Case-Insensitive", async () => {
  const user = userEvent.setup();
  (getClients as jest.Mock).mockResolvedValue(mockClients);
  mockUserContext.commerce = "PETSHOP";
  render(<ClientsList />);

  await screen.findByText(/jesse/i);

  const input = screen.getByPlaceholderText("Buscar por nome...");
  await user.type(input, "Jesse");

  await waitFor(() => {
    expect(screen.getByText(/jesse/i)).toBeInTheDocument();
  });
});

it("it should retorn customer with words partial", async () => {
  const user = userEvent.setup();

  (getClients as jest.Mock).mockResolvedValue(mockClients);
  mockUserContext.commerce = "PETSHOP";
  render(<ClientsList />);

  await screen.findByText(/carlos/i);

  const input = screen.getByPlaceholderText("Buscar por nome...");
  await user.type(input, "car");

  await waitFor(() => {
    expect(screen.getByText(/carlos/i)).toBeInTheDocument();
  });
});

it("it should return all customer when clear the input", async () => {
  const user = userEvent.setup();

  (getClients as jest.Mock).mockResolvedValue(mockClients);
  mockUserContext.commerce = "PETSHOP";
  render(<ClientsList />);

  await screen.findByText(/carlos/i);
  await screen.findByText(/maria/i);

  const input = screen.getByPlaceholderText("Buscar por nome...");
  await user.type(input, "carlos");
  await user.clear(input);

  expect(getClients).toHaveBeenCalled();

  await waitFor(() => {
    expect(screen.getAllByText(/carlos/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/maria/i).length).toBeGreaterThan(0);
  });
});
