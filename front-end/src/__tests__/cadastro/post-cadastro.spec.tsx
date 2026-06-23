import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormCadastro from "../../components/formCustomer";
import { cadastroData } from "../../services/cadastro";
import { mockUserContext } from "../__mocks__/userContext";
import toast from "react-hot-toast";

jest.mock("@/context/UserContext", () => ({
  useUser: () => mockUserContext,
}));

jest.mock("react-hot-toast", () => {
  const mockToast = {
    success: jest.fn(),
    error: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockToast,
    toast: mockToast,
  };
});

const mockToast = toast as unknown as {
  success: jest.Mock;
  error: jest.Mock;
};

jest.mock("../../services/cadastro", () => ({
  cadastroData: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("POST cadastro", () => {
  it("Should create a new client successfully", async () => {
    (cadastroData as jest.Mock).mockResolvedValue({});

    mockUserContext.commerce = "PETSHOP";

    render(<FormCadastro />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Nome do Cliente/i), "Jesse");
    await user.type(screen.getByLabelText(/Telefone/i), "19983350238");
    await user.type(screen.getByLabelText(/Endereço/i), "Rua mario azevedo n=14");

    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(cadastroData).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith("Cadastro realizado com sucesso!");
    });
  });
  it("should show error message, when fields are empty", async () => {
    (cadastroData as jest.Mock).mockResolvedValue(new Error("Erro na conexão com o servidor."));

    mockUserContext.commerce = "PETSHOP";

    render(<FormCadastro />);

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Preencha o nome do cliente!");
    });
  });

  it("should show erro message, when server to fall", async () => {
    (cadastroData as jest.Mock).mockRejectedValue(new Error("Erro na conexão com o servidor"));

    mockUserContext.commerce = "PETSHOP";

    render(<FormCadastro />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Nome do Cliente/i), "Jesse");

    await user.type(screen.getByLabelText(/Telefone/i), "19983350238");

    await user.type(screen.getByLabelText(/Endereço/i), "Rua mario azevedo n=14");

    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro na conexão com o servidor.");
    });
  });
});
