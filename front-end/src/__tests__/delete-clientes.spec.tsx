import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import toast, { Toaster } from "react-hot-toast";
import ClientsList from "../components/ClientList";
import { deleteCliente } from "../services/customer/delete";
import { getClients } from "../services/customer/get";

// Mock toast
jest.mock("react-hot-toast", () => {
  return {
    __esModule: true,
    default: {
      success: jest.fn(),
      error: jest.fn(),
    },
    Toaster: () => <div data-testid="toaster" />,
  };
});

jest.mock("../services/customer/delete", () => ({
  deleteCliente: jest.fn(),
}));

jest.mock("../services/customer/get", () => ({
  getClients: jest.fn(),
}));

// Mock UserContext
jest.mock("../context/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
  useUser: () => ({
    userName: "jesse",
    isAdmin: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockClients = [
  {
    id: "1",
    customer_name: "João",
    pet_name: "Rex",
    created_at: "2025-08-30T14:48:03.026Z",
    address: "av luis-15 n=134",
    number_customer: "19993451232",
    pet_beed: "vira-lata",
    last_bath: "2026-01-28T21:31:18.551Z",
  },
  {
    id: "2",
    customer_name: "Maria",
    pet_name: "Luna",
    created_at: "2025-08-31T10:20:00.000Z",
    address: "Rua mario azevedo n=14",
    number_customer: "19983350238",
    pet_beed: "vira-lata",
    last_bath: "2026-02-02T21:31:18.551Z",
  },
];

describe("DELETE client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Must open confirmation modal when clicking delete", async () => {
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    (deleteCliente as jest.Mock).mockResolvedValue({});

    render(<ClientsList />);

    const joao = await screen.findByText("João");
    const row = joao.closest("tr")!;
    const deleteButton = within(row).getByLabelText("Excluir");

    fireEvent.click(deleteButton);

    expect(screen.getByRole("heading", { name: /confirmar exclusão/i })).toBeInTheDocument();

    expect(screen.getByText(/Excluir cliente João e o pet Rex?/i)).toBeInTheDocument();
  });

  it("Must delete the client when confirming success", async () => {
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    (deleteCliente as jest.Mock).mockResolvedValue({});

    render(
      <>
        <ClientsList />
        <Toaster />
      </>,
    );

    const joao = await screen.findByText("João");
    const row = joao.closest("tr")!;
    fireEvent.click(within(row).getByLabelText("Excluir"));

    const modal = await screen.findByRole("dialog");
    const confirmButton = within(modal).getByRole("button", {
      name: "Excluir",
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteCliente).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith("Cliente excluído com sucesso");
    });
  });

  it("Must show error when DELETE fails", async () => {
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    (deleteCliente as jest.Mock).mockRejectedValue(new Error("Error"));

    render(
      <>
        <ClientsList />
        <Toaster />
      </>,
    );

    const joao = await screen.findByText("João");
    const row = joao.closest("tr")!;
    fireEvent.click(within(row).getByLabelText("Excluir"));

    const modal = await screen.findByRole("dialog");
    fireEvent.click(within(modal).getByRole("button", { name: "Excluir" }));

    await waitFor(() => {
      expect(deleteCliente).toHaveBeenCalledWith("1");
      expect(toast.error).toHaveBeenCalledWith("Erro ao excluir cliente");
    });

    // Cliente continua na tela
    expect(screen.getByText("João")).toBeInTheDocument();
  });
});
