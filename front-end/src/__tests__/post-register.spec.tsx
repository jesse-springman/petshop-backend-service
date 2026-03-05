import { mockFetch } from "./__mocks__/fetch";
import { registerData } from "@/services/register";
import { render, screen, fireEvent } from "@testing-library/react";
import FormRegister from "../app/registro/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("POST /registro", () => {
  beforeEach(() => {
    jest.resetAllMocks();
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

    fireEvent.change(screen.getByLabelText(/Nome do Colaborador/i), {
      target: { value: "jesse" },
    });

    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText(/Cadastrar/i));

    expect(fetch).toHaveBeenCalled();
  });
});
