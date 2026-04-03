import { postAgenda } from "../../services/agenda/post";
import { mockAppointment } from "../__mocks__/agenda/get-appointments";
import { propsDetailsModal } from "../__mocks__/agenda/propsDetailsAppointments";
import { screen, render, waitFor, getByText } from "@testing-library/react";
import { DetailsAppointmentModal } from "../../components/DetailsAppointmentModal";
import { NewAppointmentModal } from "../../components/NewAppointmentModal";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { getClients } from "../../services/customer/get";
import { mockClients } from "../__mocks__/cliente/list-clientes";

const user = userEvent.setup();

jest.mock("../../services/agenda/post", () => ({
  postAgenda: jest.fn(),
}));

jest.mock("../../services/customer/get", () => ({
  getClients: jest.fn(),
}));

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const prposNewAppointments = {
  dateSelect: tomorrow,
  onClose: jest.fn(),
  onSuccess: jest.fn(),
};

//wrapper que simula a pagina
const Wrapper = () => {
  const [showNew, setShowNew] = useState(false);

  return (
    <>
      <DetailsAppointmentModal {...propsDetailsModal} onNewAppointment={() => setShowNew(true)} />
      {showNew && <NewAppointmentModal {...prposNewAppointments} />}
    </>
  );
};

describe("POST /agenda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getClients as jest.Mock).mockResolvedValue(mockClients);
  });

  it("Should open NewAppointmentModal successfully", async () => {
    render(<Wrapper />);

    await user.click(screen.getByText(/Novo Agendamento/i));

    expect(screen.getByLabelText(/selecione o pet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/selecione o Horário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/selecione o Serviço/i)).toBeInTheDocument();
  });

  it("Should render list of customer in `Selecione o pet`", async () => {
    render(<Wrapper />);

    await waitFor(() => {
      user.click(screen.getByText("+ Novo Agendamento"));
      user.click(screen.getByLabelText(/selecione o pet/i));
    });

    expect(screen.getByRole("option", { name: /cacau/i }));
    expect(screen.getByRole("option", { name: /bolinha/i }));
    expect(screen.getByRole("option", { name: /tom/i }));
  });

  it("Should render list of hours in `Selecione o Horário`", async () => {
    render(<Wrapper />);

    await user.click(screen.getByText("+ Novo Agendamento"));
    await user.click(screen.getByLabelText(/selecione o horário/i));

    expect(screen.getByRole("option", { name: /08:00/i }));
    expect(screen.getByRole("option", { name: /09:00/i }));
    expect(screen.getByRole("option", { name: /10:00/i }));
    expect(screen.getByRole("option", { name: /11:00/i }));
    expect(screen.getByRole("option", { name: /12:00/i }));
    expect(screen.getByRole("option", { name: /13:00/i }));
    expect(screen.getByRole("option", { name: /18:00/i }));
  });

  it("should render list services in `Selecione o Serviço`", async () => {
    render(<Wrapper />);

    await user.click(screen.getByText("+ Novo Agendamento"));
    await user.click(screen.getByLabelText(/selecione o Serviço/i));

    expect(screen.getByRole("option", { name: "Banho" }));
    expect(screen.getByRole("option", { name: "Tosa" }));
    expect(screen.getByRole("option", { name: "Banho e Tosa" }));
    expect(screen.getByRole("option", { name: "Hidratação" }));
    expect(screen.getByRole("option", { name: "Corte de unha" }));
  });

  it("should show message when some field not be filled", async () => {
    render(<Wrapper />);

    await user.click(screen.getByText("+ Novo Agendamento"));
    await user.click(screen.getByRole("button", { name: "Salvar agendamento" }));

    await expect(screen.getByText("Preencha todos os campos"));
  });

  it("should register new Scheduling successfully", async () => {
    (postAgenda as jest.Mock).mockResolvedValue({ ok: true });

    render(<Wrapper />);

    await user.click(screen.getByText("+ Novo Agendamento"));

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /cacau/i })).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText(/selecione o pet/i), mockClients[0].id);
    await user.selectOptions(screen.getByLabelText(/selecione o horário/i), "14:00");
    await user.selectOptions(screen.getByLabelText(/selecione o serviço/i), "Banho");

    await user.click(screen.getByRole("button", { name: "Salvar agendamento" }));

    expect(screen.getByText("Agendamento realizado com sucesso")).toBeInTheDocument();
    expect(postAgenda).toHaveBeenCalledTimes(1);
  });

  it("Should mark occupied times as disabled", async () => {
    render(<NewAppointmentModal {...prposNewAppointments} existingTimes={["10:00", "11:00"]} />);

    expect(screen.getByRole("option", { name: "10:00 - ocupado" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "11:00 - ocupado" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "09:00" })).not.toBeDisabled();
  });

  it("Should show message erro when API fails", async () => {
    (postAgenda as jest.Mock).mockRejectedValue(new Error("Server error"));

    render(<Wrapper />);

    await user.click(screen.getByText("+ Novo Agendamento"));

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /cacau/i })).toBeInTheDocument();
    });

    user.selectOptions(screen.getByLabelText(/selecione o pet/i), mockClients[0].id);
    user.selectOptions(screen.getByLabelText(/selecione o horário/i), "14:00");
    user.selectOptions(screen.getByLabelText(/selecione o serviço/i), "Banho");

    await user.click(screen.getByRole("button", { name: "Salvar agendamento" }));

    expect(
      await screen.getByText("Erro ao criar agendamento, tente mais tarde"),
    ).toBeInTheDocument();
  });
});
