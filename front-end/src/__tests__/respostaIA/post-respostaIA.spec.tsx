import { getByText, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getClients } from "../../services/customer/get";
import { mockClients } from "../__mocks__/cliente/list-clientes";
import RespostaIAPage from "../../app/respostaIA/page";
import { postGenerateMessageAI } from "../../services/aiGenerate/post";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("../../services/customer/get", () => ({
  getClients: jest.fn(),
}));

jest.mock("../../services/aiGenerate/post", () => ({
  postGenerateMessageAI: jest.fn(),
}));

describe("/respostaIA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getClients as jest.Mock).mockResolvedValue(mockClients);
  });

  it("should render all clients", async () => {
    render(<RespostaIAPage />);

    await waitFor(() => {
      expect(screen.getByText("jesse")).toBeInTheDocument();
    });
  });

  it("should message erro when not show clients", async () => {
    (getClients as jest.Mock).mockRejectedValue(new Error("Erro"));

    render(<RespostaIAPage />);

    await waitFor(() => {
      expect(screen.getByText("Não foi possível localizar os clientes.")).toBeInTheDocument();
    });
  });

  it("should filter customers when to type name in search", async () => {
    const user = userEvent.setup();

    render(<RespostaIAPage />);

    const input = screen.getByPlaceholderText("Buscar por cliente ou pet...");
    await user.type(input, "jesse");

    await waitFor(() => {
      expect(screen.getByText("jesse")).toBeInTheDocument();
    });
  });

  it("should message when customer not found in search", async () => {
    const user = userEvent.setup();

    render(<RespostaIAPage />);

    const input = screen.getByPlaceholderText("Buscar por cliente ou pet...");
    await user.type(input, "inexistente");

    await waitFor(() => {
      expect(screen.getByText("Nenhum cliente encontrado")).toBeInTheDocument();
    });
  });

  it("should disable generate button when no client is selected", async () => {
    render(<RespostaIAPage />);

    await waitFor(() => {
      expect(screen.getByText(/jesse/i)).toBeInTheDocument();
    });

    const btn = screen.getByRole("button", { name: /Gerar mensagem/i });

    expect(btn).toBeDisabled();
  });

  it("should show selected indicator when client is clicked", async () => {
    const user = userEvent.setup();

    render(<RespostaIAPage />);

    await waitFor(() => {
      expect(screen.getByText(/jesse/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/jesse/i));

    expect(screen.getByText(/✓ selecionado/i)).toBeInTheDocument();
  });

  it("should clear the customer selected when click limpar seleção", async () => {
    const user = userEvent.setup();

    render(<RespostaIAPage />);

    await waitFor(() => {
      expect(screen.getByText(/jesse/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/jesse/i));

    expect(screen.getByText(/✓ selecionado/i)).toBeInTheDocument();

    await user.click(screen.getByText(/limpar seleção/i));

    expect(screen.queryByText(/✓ selecionado/i)).not.toBeInTheDocument();
  });

  it("should release button when customer is selected", async () => {
    const user = userEvent.setup();

    render(<RespostaIAPage />);

    const input = screen.getByPlaceholderText("Buscar por cliente ou pet...");
    await user.type(input, "jesse");

    expect(screen.getByText("jesse")).toBeInTheDocument();

    const select = await screen.findByRole("combobox");

    expect(select).toHaveValue("LEMBRETE_BANHO");

    await user.selectOptions(select, "AGENDAMENTO");
    expect(select).toHaveValue("AGENDAMENTO");

    await user.selectOptions(select, "COBRANCA");
    expect(select).toHaveValue("COBRANCA");
  });

  it("should return anwser of IA with type right", async () => {
    (postGenerateMessageAI as jest.Mock).mockResolvedValue("Mensagem gerada pela IA");

    const user = userEvent.setup();

    render(<RespostaIAPage />);

    await waitFor(() => {
      expect(screen.getByText("jesse")).toBeInTheDocument();
    });

    await user.click(screen.getByText("jesse"));

    const select = await screen.findByRole("combobox");

    expect(select).toHaveValue("LEMBRETE_BANHO");

    await user.click(screen.getByRole("button", { name: /Gerar mensagem/i }));

    await waitFor(() => {
      expect(screen.getByText("Mensagem gerada pela IA")).toBeInTheDocument();
    });
  });

  it("should show message error when API-AI without response", async () => {
    (postGenerateMessageAI as jest.Mock).mockRejectedValue(new Error("erro"));

    const user = userEvent.setup();

    render(<RespostaIAPage />);

    await waitFor(() => {
      expect(screen.getByText(/jesse/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/jesse/i));

    const selected = await screen.findByRole("combobox");

    expect(selected).toHaveValue("LEMBRETE_BANHO");

    await user.click(screen.getByRole("button", { name: /Gerar mensagem/i }));

    await waitFor(() => {
      expect(screen.getByText(/Erro ao gerar mensagem/i)).toBeInTheDocument();
    });
  });

  it("should show copy and whatsapp buttons after message is generated", async () => {
    (postGenerateMessageAI as jest.Mock).mockResolvedValue("OK");

    const user = userEvent.setup();

    render(<RespostaIAPage />);

    await waitFor(() => {
      expect(screen.getByText(/jesse/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/jesse/i));
    await user.click(screen.getByRole("button", { name: /Gerar mensagem/i }));

    await waitFor(() => {
      expect(screen.getByText(/Copiar/i)).toBeInTheDocument();
      expect(screen.getByText(/Whatsapp/i)).toBeInTheDocument();
    });
  });
});
