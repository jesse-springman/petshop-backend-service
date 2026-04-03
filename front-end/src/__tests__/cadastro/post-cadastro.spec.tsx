import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormCadastro from "../../components/formCustomer";
import { cadastroData } from "../../services/cadastro";

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
    (cadastroData as jest.Mock).mockResolvedValue({
      id: "1",
      customer_name: "jesse",
      pet_name: "cacau",
      created_at: "2025-12-30T14:48:03.026Z",
      address: "Rua mario azevedo n=14",
      number_customer: "19983350238",
      pet_beed: "vira-lata",
      last_bath: "2026-03-30",
    });

    render(<FormCadastro />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Nome do Cliente/i), "Jesse");

    await user.type(screen.getByLabelText(/Nome do Pet/i), "cacau");

    await user.type(screen.getByLabelText(/Raça do Pet/i), "vira-lata");

    await user.type(screen.getByLabelText(/Número do Cliente/i), "19983350238");

    await user.type(screen.getByLabelText(/Endereço do Cliente/i), "Rua mario azevedo n=14");

    await user.type(screen.getByLabelText(/Data do Último banho :/i), "2026-03-30");

    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(cadastroData).toHaveBeenCalledTimes(1);

    expect(await screen.getByText(/Cadastro realizado com sucesso!/i)).toBeInTheDocument();
  });

  it("should show error message, when fields are empty", async () => {
    (cadastroData as jest.Mock).mockResolvedValue(new Error("Erro na conexão com o servidor."));
    render(<FormCadastro />);

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(await screen.findByText(/Preencha todos os campos!/i)).toBeInTheDocument();
  });

  it("should show erro message, when server to fall", async () => {
    (cadastroData as jest.Mock).mockRejectedValue(new Error("Erro na conexão com o servidor"));

    render(<FormCadastro />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/nome do cliente/i), "Jesse");
    await user.type(screen.getByLabelText(/nome do pet/i), "Cacau");
    await user.type(screen.getByLabelText(/raça do pet/i), "Vira-lata");
    await user.type(screen.getByLabelText(/número do cliente/i), "19999999999");
    await user.type(screen.getByLabelText(/endereço do cliente/i), "Rua A");
    await user.type(screen.getByLabelText(/data do último banho/i), "2026-03-30");

    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(await screen.findByText(/Erro na conexão com o servidor/i)).toBeInTheDocument();
  });
});
