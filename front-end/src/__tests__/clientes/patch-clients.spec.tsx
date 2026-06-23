import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import ClientsList from "@/components/ClientList";
import userEvent from "@testing-library/user-event";
import { patchClientList } from "../../services/customer/patch";
import { getClients } from "../../services/customer/get";
import { mockUserContext } from "../__mocks__/userContext";

jest.mock("@/context/UserContext", () => ({
  useUser: () => mockUserContext,
}));

//mock do useUser simulando alguém logado
jest.mock("../../context/UserContext", () => ({
  useUser: () => ({
    userName: "jesse",
    isAdmin: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("../../services/customer/patch", () => ({
  patchClientList: jest.fn(),
}));

jest.mock("../../services/customer/get", () => ({
  getClients: jest.fn(),
}));

const mockClients = [
  {
    id: "1",
    name: "Jesse",

    created_at: "2025-08-30T14:48:03.026Z",
    address: "av luis-15 n=134",
    phone: "19993451232",
  },
  {
    id: "2",
    name: "Gabi",
    created_at: "2025-08-30T10:20:00.000Z",
    address: "Rua mario azevedo n=14",
    phone: "19983350238",
  },
];

describe("Edit Inline in table Customers", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getClients as jest.Mock).mockResolvedValue(mockClients);

    (patchClientList as jest.Mock).mockImplementation((url, options) => {
      if (options?.method === "PATCH") {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({}),
        });
      }

      return Promise.resolve({
        ok: true,
        json: async () => mockClients,
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Must show button "Editar" in each line', async () => {
    mockUserContext.commerce = "PETSHOP";
    render(<ClientsList />);

    await screen.findByText("Jesse"); //espera a tabela carregar

    const editBtns = screen.getAllByRole("button", { name: /editar/i });

    expect(editBtns).toHaveLength(2);
  });

  it('Must go into mode edition when click in "Editar', async () => {
    mockUserContext.commerce = "PETSHOP";
    render(<ClientsList />);
    await screen.findByText("Jesse");
    screen.debug();
    const editBtn = screen.getAllByRole("button", { name: /editar/i });

    fireEvent.click(editBtn[0]);

    expect(screen.getByDisplayValue("Jesse")).toBeInTheDocument();
    expect(screen.getByDisplayValue("av luis-15 n=134")).toBeInTheDocument();
    expect(screen.getByDisplayValue("19993451232")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar edição/i })).toBeInTheDocument();
  });

  it("should allow edit in fields and save data", async () => {
    (patchClientList as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    });

    mockUserContext.commerce = "PETSHOP";
    render(<ClientsList />);

    await screen.findByText("Jesse");

    const editBtns = screen.getAllByRole("button", { name: /editar/i });
    fireEvent.click(editBtns[0]);

    const inputName = screen.getByDisplayValue("Jesse");
    const inputAddress = screen.getByDisplayValue("av luis-15 n=134");
    const inputNumberCustomer = screen.getByDisplayValue("19993451232");

    fireEvent.change(inputName, { target: { value: "New-Jesse" } });
    fireEvent.change(inputAddress, { target: { value: "New Address" } });
    fireEvent.change(inputNumberCustomer, { target: { value: "19988888888" } });

    fireEvent.click(screen.getByText("Salvar"));

    expect(await screen.findByText("New-Jesse")).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: /editar/i })).toHaveLength(2);
  });

  it("Must cancel the edtion and back original state", async () => {
    mockUserContext.commerce = "PETSHOP";
    render(<ClientsList />);

    await screen.findByText("Jesse");

    const editBtn = screen.getAllByRole("button", { name: /editar/i });
    fireEvent.click(editBtn[0]);

    const inputName = screen.getByDisplayValue("Jesse");
    fireEvent.change(inputName, { target: { value: "nome que vai salvar" } });
    fireEvent.click(screen.getByLabelText(/cancelar edição/i));
    await waitFor(() => {
      expect(screen.getByText("Jesse")).toBeInTheDocument();
      expect(screen.queryByDisplayValue("nome que vai salvar")).not.toBeInTheDocument();
    });
  });
});
