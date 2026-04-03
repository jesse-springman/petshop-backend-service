jest.mock("../../services/agenda/patch", () => ({
  patchAppointments: jest.fn(),
}));

import { DetailsAppointmentModal } from "../../components/DetailsAppointmentModal";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { mockAppointment } from "../__mocks__/agenda/get-appointments";
import { patchAppointments } from "../../services/agenda/patch";

beforeEach(() => {
  (patchAppointments as jest.Mock).mockResolvedValue({ ok: true });
});

describe("PATCH status", () => {
  it("should show status", () => {
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

    await waitFor(() => {
      expect(screen.getByText("Concluído")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Concluído"));

    await waitFor(() => {
      expect(mockStatusChange).toHaveBeenCalled();
    });
  });

  it("should keep same Status when click cancelar", async () => {
    const mockStatusChange = jest.fn().mockResolvedValue(undefined);

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
