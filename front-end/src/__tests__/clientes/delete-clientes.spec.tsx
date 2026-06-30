import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import toast, { Toaster } from "react-hot-toast";
import ClientsList from "../../components/ClientList";
import { deleteCliente } from "../../services/customer/delete";
import { getClients } from "../../services/customer/get";
import { mockUserContext } from "../__mocks__/userContext";

jest.mock("@/context/UserContext", () => ({
  useUser: () => mockUserContext,
}));

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

jest.mock("../../services/customer/delete", () => ({
  deleteCliente: jest.fn(),
}));

jest.mock("../../services/customer/get", () => ({
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
    name: "João",
    created_at: "2025-08-30T14:48:03.026Z",
    address: "av luis-15 n=134",
    phone: "19993451232",
  },
  {
    id: "2",
    name: "Maria",
    created_at: "2025-08-31T10:20:00.000Z",
    address: "Rua mario azevedo n=14",
    phone: "19983350238",
  },
];

describe("DELETE client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockUserContext, {
      commerce: "PETSHOP",
      userName: null,
      businessId: null,
      businessName: null,
      isAdmin: true,
      isSuperAdmin: false,
      loading: false,
    });
  });

  it("Must open confirmation modal when clicking delete", async () => {
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    (deleteCliente as jest.Mock).mockResolvedValue({});

    render(<ClientsList />);

    const joao = await screen.findByText("João");
    const row = joao.closest("tr")!;
    const deleteButton = within(row).getByLabelText("excluir");

    fireEvent.click(deleteButton);

    expect(screen.getByRole("heading", { name: /confirmar exclusão/i })).toBeInTheDocument();
    expect(screen.getByText(/Excluir o cliente João\?/i)).toBeInTheDocument();
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
    fireEvent.click(within(row).getByLabelText("excluir"));

    const modal = await screen.findByRole("dialog");
    const confirmButton = within(modal).getByRole("button", { name: "Confirmar" });

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

    await waitFor(() => {
      expect(getClients).toHaveBeenCalled();
    });

    const joao = await screen.findByText("João");
    const row = joao.closest("tr")!;
    fireEvent.click(within(row).getByLabelText("excluir"));

    const modal = await screen.findByRole("dialog");
    fireEvent.click(within(modal).getByRole("button", { name: "Confirmar" }));

    await waitFor(() => {
      expect(deleteCliente).toHaveBeenCalledWith("1");
      expect(toast.error).toHaveBeenCalledWith("Erro ao excluir cliente");
    });

    expect(screen.getByText("João")).toBeInTheDocument();
  });
});
