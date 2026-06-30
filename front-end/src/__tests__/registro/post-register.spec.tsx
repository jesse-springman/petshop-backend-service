import { mockFetch } from "../__mocks__/fetch";
import { registerData } from "@/services/register";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormRegister from "../../app/registro/page";
import { mockUserContext } from "../__mocks__/userContext";
import { getServices } from "@/services/servicesBusiness/get-service";
import { createService } from "@/services/servicesBusiness/post-service";
import { updateService } from "@/services/servicesBusiness/patch-service";
import { deleteService } from "@/services/servicesBusiness/delete-service";
import { mockServices } from "../__mocks__/servicesBusiness/servicesMock";

jest.mock("@/context/UserContext", () => ({
  useUser: () => mockUserContext,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/services/servicesBusiness/get-service", () => ({
  getServices: jest.fn(),
}));

jest.mock("@/services/servicesBusiness/post-service", () => ({
  createService: jest.fn(),
}));

jest.mock("@/services/servicesBusiness/patch-service", () => ({
  updateService: jest.fn(),
}));

jest.mock("@/services/servicesBusiness/delete-service", () => ({
  deleteService: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("POST /registro", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    Storage.prototype.getItem = jest.fn().mockReturnValue("fake-token");
    mockUserContext.commerce = "PETSHOP";
    mockUserContext.isAdmin = true;
  });

  it("should call fetch with sucessful", async () => {
    mockFetch({
      ok: true,
      status: 200,
      body: { id: "1", name: "jesse" },
    });

    await registerData({
      name: "jesse",
      password: "1234",
      role: "ADMIN",
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/register"),
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer fake-token",
        },
        body: JSON.stringify({
          name: "jesse",
          password: "1234",
          role: "ADMIN",
        }),
      }),
    );
  });

  it("should throw erro if response not of", async () => {
    mockFetch({
      ok: false,
      status: 200,
      body: { id: "1", name: "gabi" },
    });

    await expect(
      registerData({
        name: "gabi",
        password: "1234",
        role: "USER",
      }),
    ).rejects.toThrow("Erro ao cadastrar usuário");
  });

  it("should submit form", async () => {
    render(<FormRegister />);
    const user = userEvent.setup();

    await userEvent.type(screen.getByLabelText(/Nome do Colaborador/i), "jesse");
    await userEvent.type(screen.getByLabelText("Senha"), "123456");
    await userEvent.type(screen.getByLabelText("Confirmação de senha"), "123456");

    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(fetch).toHaveBeenCalled();
  });

  it("should show error when passwords dont match", async () => {
    render(<FormRegister />);
    const user = userEvent.setup();

    await userEvent.type(screen.getByLabelText(/Nome do Colaborador/i), "jesse");
    await userEvent.type(screen.getByLabelText("Senha"), "123456");
    await userEvent.type(screen.getByLabelText("Confirmação de senha"), "654321");

    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(screen.getByText("Senhas estão diferentes")).toBeInTheDocument();
  });

  it("should show error when fields are empty", async () => {
    render(<FormRegister />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(screen.getByText("Preencha todos os campos!")).toBeInTheDocument();
  });
});

describe("Aba Serviços", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserContext.commerce = "PETSHOP";
    mockUserContext.isAdmin = true;
    (getServices as jest.Mock).mockResolvedValue(mockServices);
    (createService as jest.Mock).mockResolvedValue(mockServices[0]);
    (updateService as jest.Mock).mockResolvedValue({ ...mockServices[0], name: "Banho Premium" });
    (deleteService as jest.Mock).mockResolvedValue(undefined);
  });

  it("should show Serviços tab only for admin", async () => {
    render(<FormRegister />);
    expect(screen.getByText(/🛎️ Serviços/i)).toBeInTheDocument();
  });

  it("should not show Serviços tab for non-admin", () => {
    mockUserContext.isAdmin = false;
    render(<FormRegister />);
    expect(screen.queryByText(/🛎️ Serviços/i)).not.toBeInTheDocument();
  });

  it("should load and display services when clicking Serviços tab", async () => {
    render(<FormRegister />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/🛎️ Serviços/i));

    await waitFor(() => {
      expect(getServices).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText("Banho")).toBeInTheDocument();
      expect(screen.getByText("Tosa")).toBeInTheDocument();
      expect(screen.getByText("Banho e Tosa")).toBeInTheDocument();
    });
  });

  it("should show empty state when no services", async () => {
    (getServices as jest.Mock).mockResolvedValue([]);
    render(<FormRegister />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/🛎️ Serviços/i));

    await waitFor(() => {
      expect(screen.getByText("Nenhum serviço cadastrado ainda")).toBeInTheDocument();
    });
  });

  it("should create a new service successfully", async () => {
    render(<FormRegister />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/🛎️ Serviços/i));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Nome do serviço")).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("Nome do serviço"), "Hidratação");
    await user.type(screen.getByPlaceholderText("Preço"), "50");

    await user.click(screen.getByRole("button", { name: /Adicionar Serviço/i }));

    await waitFor(() => {
      expect(createService).toHaveBeenCalledWith({
        name: "Hidratação",
        price: 50,
      });
    });
  });

  it("should show error when creating service without name or price", async () => {
    const toast = require("react-hot-toast");
    render(<FormRegister />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/🛎️ Serviços/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Adicionar Serviço/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Adicionar Serviço/i }));

    expect(toast.error).toHaveBeenCalledWith("Preencha nome e preço do serviço");
  });

  it("should delete a service successfully", async () => {
    render(<FormRegister />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/🛎️ Serviços/i));

    await waitFor(() => {
      expect(screen.getByText("Banho")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText("remover serviço");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteService).toHaveBeenCalledWith(mockServices[0].id);
    });
  });

  it("should enter edit mode when clicking edit button", async () => {
    render(<FormRegister />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/🛎️ Serviços/i));

    await waitFor(() => {
      expect(screen.getByText("Banho")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByLabelText("editar serviço");
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Salvar/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
    });
  });

  it("should update service successfully", async () => {
    render(<FormRegister />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/🛎️ Serviços/i));

    await waitFor(() => {
      expect(screen.getByText("Banho")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByLabelText("editar serviço")[0]);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Salvar/i })).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue("Banho");
    await user.clear(nameInput);
    await user.type(nameInput, "Banho Premium");

    await user.click(screen.getByRole("button", { name: /Salvar/i }));

    await waitFor(() => {
      expect(updateService).toHaveBeenCalledWith(
        mockServices[0].id,
        expect.objectContaining({ name: "Banho Premium" }),
      );
    });
  });

  it("should cancel edit mode", async () => {
    render(<FormRegister />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/🛎️ Serviços/i));

    await waitFor(() => {
      expect(screen.getByText("Banho")).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByLabelText("editar serviço")[0]);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Cancelar/i }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /Salvar/i })).not.toBeInTheDocument();
      expect(screen.getByText("Banho")).toBeInTheDocument();
    });
  });
});
