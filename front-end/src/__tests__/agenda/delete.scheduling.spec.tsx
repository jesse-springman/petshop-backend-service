import { deleteAppointment } from "../../services/agenda/delete";
import { mockAppointment } from "../__mocks__/agenda/get-appointments";
import { propsDetailsModal } from "../__mocks__/agenda/propsDetailsAppointments";
import { screen, render, waitFor } from "@testing-library/react";
import { DetailsAppointmentModal } from "../../components/DetailsAppointmentModal";
import userEvent from "@testing-library/user-event";

jest.mock("../../services/agenda/delete", () => ({
  deleteAppointment: jest.fn(),
}));

describe("DELETE scheduling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should open Modal confirm Delete Scheduling", async () => {
    render(<DetailsAppointmentModal {...propsDetailsModal} />);

    expect(screen.getByText("Rex")).toBeInTheDocument();

    const user = userEvent.setup();
    const btnTrash = screen.getByText("🗑️");

    await user.click(btnTrash);

    await waitFor(() => {
      expect(screen.getByText("Confirmar exclusão")).toBeInTheDocument();
    });
  });

  it("Should show customer name in Modal", async () => {
    render(<DetailsAppointmentModal {...propsDetailsModal} />);

    const user = userEvent.setup();
    await user.click(screen.getByText("🗑️"));

    await waitFor(() => {
      expect(screen.getByText("Joao Silva")).toBeInTheDocument();
    });
  });

  it("Should closed Modal when click in cancelar without DELETE", async () => {
    render(<DetailsAppointmentModal {...propsDetailsModal} />);

    const user = userEvent.setup();
    await user.click(screen.getByText("🗑️"));

    await waitFor(() => {
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Cancelar"));

    await waitFor(() => {
      expect(screen.queryByText("Confirmar exclusão")).not.toBeInTheDocument();
      expect(screen.queryByText("Agendamentos do dia")).toBeInTheDocument();

      expect(deleteAppointment).not.toHaveBeenCalled();
    });
  });

  it("Should call deteleAppointment that id correct in confirm", async () => {
    (deleteAppointment as jest.Mock).mockResolvedValue({
      ok: true,
    });

    render(<DetailsAppointmentModal {...propsDetailsModal} />);

    const user = userEvent.setup();

    await user.click(screen.getByText("🗑️"));

    await user.click(screen.getByText("Excluir"));

    expect(deleteAppointment).toHaveBeenCalledWith(mockAppointment.id);
  });

  it("Should call onStatusChange after delete successfully", async () => {
    (deleteAppointment as jest.Mock).mockResolvedValue({ ok: true });

    render(<DetailsAppointmentModal {...propsDetailsModal} />);

    const user = userEvent.setup();
    await user.click(screen.getByText("🗑️"));

    await user.click(screen.getByText("Excluir"));

    await expect(propsDetailsModal.onStatusChange).toHaveBeenCalled();
  });

  it("Should closed modalDetails after confirm delete", async () => {
    (deleteAppointment as jest.Mock).mockResolvedValue({ ok: true });

    render(<DetailsAppointmentModal {...propsDetailsModal} />);

    const user = userEvent.setup();
    await user.click(screen.getByText("🗑️"));
    await user.click(screen.getByText("Excluir"));

    await waitFor(() => {
      expect(screen.queryByText("Confirmar exclusão")).not.toBeInTheDocument();
    });
  });
});
