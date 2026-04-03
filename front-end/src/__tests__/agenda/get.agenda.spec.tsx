import { AgendaPage } from "../../components/AgendaPage";
import { render, screen, waitFor } from "@testing-library/react";
import { getAppointment } from "../../services/agenda/get";
import { getClients } from "../../services/customer/get";
import { mockAppointment } from "../__mocks__/agenda/get-appointments";
import userEvent from "@testing-library/user-event";

jest.mock("../../services/agenda/get", () => ({
  getAppointment: jest.fn(),
}));

jest.mock("../../services/customer/get", () => ({
  getClients: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe(" GET / agenda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show the Calendar", async () => {
    (getAppointment as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<AgendaPage />);

    //mes esta dentro de um elemento h1, verifica se esta em tela
    await waitFor(() => {
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
  });

  it("Should show scheduling correct day", async () => {
    (getAppointment as jest.Mock).mockResolvedValue([mockAppointment]);

    render(<AgendaPage />);

    await waitFor(() => {
      expect(screen.getByText("1 Pets Agendados")).toBeInTheDocument();
    });
  });

  it("should show more details about scheduling, when clicking", async () => {
    (getAppointment as jest.Mock).mockResolvedValue([mockAppointment]);

    render(<AgendaPage />);

    const user = userEvent.setup();

    const detailsAppointments = await screen.findByText("1 Pets Agendados");

    await user.click(detailsAppointments);

    const petName = await screen.findByText("Rex");

    expect(petName).toBeInTheDocument();
  });

  it("should render the seven days of week", async () => {
    (getAppointment as jest.Mock).mockResolvedValue([]);

    render(<AgendaPage />);

    await waitFor(() => {
      expect(screen.getByText("Dom")).toBeInTheDocument();
      expect(screen.getByText("Seg")).toBeInTheDocument();
      expect(screen.getByText("Ter")).toBeInTheDocument();
      expect(screen.getByText("Qua")).toBeInTheDocument();
      expect(screen.getByText("Qui")).toBeInTheDocument();
      expect(screen.getByText("Sex")).toBeInTheDocument();
      expect(screen.getByText("Sáb")).toBeInTheDocument();
    });
  });

  it("should show calendar empty,when it doesn't have scheduling", async () => {
    (getAppointment as jest.Mock).mockResolvedValue([]);

    render(<AgendaPage />);

    await waitFor(() => {
      expect(screen.queryByText("Pets Agendados")).not.toBeInTheDocument();
    });
  });

  it('should show button "Novo Agendamento" ', async () => {
    (getAppointment as jest.Mock).mockResolvedValue([mockAppointment]);
    (getClients as jest.Mock).mockResolvedValue([]);

    render(<AgendaPage />);

    await waitFor(() => {
      expect(getAppointment).toHaveBeenCalled();
    });

    console.log("mock date:", mockAppointment.date);
    console.log("parsed date:", new Date(mockAppointment.date).toString());
    console.log(
      "key gerada:",
      (() => {
        const d = new Date(mockAppointment.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      })(),
    );

    const day = await screen.findByText("1 Pets Agendados");

    expect(day).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(day);

    const btnNovoAgendamento = await screen.findByText(/ Novo Agendamento/i);

    expect(btnNovoAgendamento).toBeInTheDocument();

    await user.click(btnNovoAgendamento);

    await waitFor(() => {
      expect(screen.getByLabelText(/Selecione o pet/i)).toBeInTheDocument();
    });
  });
});
