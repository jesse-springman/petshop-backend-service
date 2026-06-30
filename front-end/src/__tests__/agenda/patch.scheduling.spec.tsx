import { DetailsAppointmentModal } from "../../components/DetailsAppointmentModal";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { mockAppointment } from "../__mocks__/agenda/get-appointments";
import { patchAppointments } from "../../services/agenda/patch";
import { mockUserContext } from "../__mocks__/userContext";
import { getServices } from "@/services/servicesBusiness/get-service";
import { createTransacao } from "@/services/financeiro/post";

jest.mock("@/context/UserContext", () => ({
  useUser: () => mockUserContext,
}));

jest.mock("../../services/agenda/patch", () => ({
  patchAppointments: jest.fn(),
}));

jest.mock("../../services/servicesBusiness/get-service", () => ({
  getServices: jest.fn().mockResolvedValue([]),
}));

jest.mock("../../services/financeiro/post", () => ({
  createTransacao: jest.fn().mockResolvedValue({}),
}));

beforeEach(() => {
  (patchAppointments as jest.Mock).mockResolvedValue({ ok: true });
});

describe("PATCH status", () => {
  it("should show status", () => {
    mockUserContext.commerce = "PETSHOP";
    render(
      <DetailsAppointmentModal
        date={new Date("2026-03-21")}
        appointments={[mockAppointment]}
        onClose={jest.fn()}
        onNewAppointment={jest.fn()}
        onStatusChange={jest.fn()}
      />,
    );

    expect(screen.getByText("Agendado")).toBeInTheDocument();
  });

  it("should change the status when happen click and select another status", async () => {
    const mockStatusChange = jest.fn().mockResolvedValue(undefined);
    mockUserContext.commerce = "PETSHOP";

    jest.mock("../../services/servicesBusiness/get-service", () => ({
      getServices: jest.fn().mockResolvedValue([]),
    }));

    render(
      <DetailsAppointmentModal
        date={new Date("2026-03-21")}
        appointments={[mockAppointment]}
        onClose={jest.fn()}
        onNewAppointment={jest.fn()}
        onStatusChange={mockStatusChange}
      />,
    );

    fireEvent.click(screen.getByText("Agendado"));

    await waitFor(() => {
      expect(screen.getByText("Concluído")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Concluído"));

    const confirmModal = await screen.findByRole("dialog");
    expect(confirmModal).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Concluir atendimento/i }));

    await waitFor(() => {
      expect(patchAppointments).toHaveBeenCalledWith(mockAppointment.id, "COMPLETED");
    });

    await waitFor(() => {
      expect(mockStatusChange).toHaveBeenCalled();
    });
  });

  it("should keep same Status when click cancelar", async () => {
    const mockStatusChange = jest.fn().mockResolvedValue(undefined);
    mockUserContext.commerce = "PETSHOP";
    render(
      <DetailsAppointmentModal
        date={new Date("2026-03-21")}
        appointments={[mockAppointment]}
        onClose={jest.fn()}
        onNewAppointment={jest.fn()}
        onStatusChange={mockStatusChange}
      />,
    );

    const user = userEvent.setup();

    expect(screen.getByText("Agendado")).toBeInTheDocument();

    await user.click(screen.getByText("Agendado"));

    expect(screen.getByText("cancelar")).toBeInTheDocument();

    await user.click(screen.getByText("cancelar"));

    expect(screen.getByText("Agendado")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockStatusChange).not.toHaveBeenCalled();
    });
  });
});
