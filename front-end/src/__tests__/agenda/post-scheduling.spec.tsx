import { postAgenda } from "../../services/agenda/post";
import { propsDetailsModal } from "../__mocks__/agenda/propsDetailsAppointments";
import { screen, render, waitFor } from "@testing-library/react";
import { DetailsAppointmentModal } from "../../components/DetailsAppointmentModal";
import { NewAppointmentModal } from "../../components/NewAppointmentModal";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { getClients } from "../../services/customer/get";
import { getServices } from "../../services/servicesBusiness/get-service";
import { mockClients } from "../__mocks__/cliente/list-clientes";
import { mockServices } from "../__mocks__/servicesBusiness/servicesMock";
import { mockUserContext } from "../__mocks__/userContext";

jest.mock("@/context/UserContext", () => ({
  useUser: () => mockUserContext,
}));

jest.mock("../../services/agenda/post", () => ({
  postAgenda: jest.fn(),
}));

jest.mock("../../services/customer/get", () => ({
  getClients: jest.fn(),
}));

jest.mock("../../services/servicesBusiness/get-service", () => ({
  getServices: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const propsNewAppointments = {
  dateSelect: tomorrow,
  onClose: jest.fn(),
  onSuccess: jest.fn(),
};

const Wrapper = () => {
  const [showNew, setShowNew] = useState(false);
  return (
    <>
      <DetailsAppointmentModal {...propsDetailsModal} onNewAppointment={() => setShowNew(true)} />
      {showNew && <NewAppointmentModal {...propsNewAppointments} />}
    </>
  );
};

describe("POST /agenda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserContext.commerce = "PETSHOP";
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    (getServices as jest.Mock).mockResolvedValue(mockServices);
  });

  it("should open NewAppointmentModal successfully", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    await user.click(screen.getByText(/Novo Agendamento/i));
    expect(screen.getByLabelText(/selecione o cliente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/selecione o horário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/selecione o serviço/i)).toBeInTheDocument();
  });

  it("should render list of customers", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    await user.click(screen.getByText(/Novo Agendamento/i));
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /jesse/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /maria/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /carlos/i })).toBeInTheDocument();
    });
  });

  it("should render list of hours", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    await user.click(screen.getByText(/Novo Agendamento/i));
    ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "18:00"].forEach((h) => {
      expect(screen.getByRole("option", { name: new RegExp(h) })).toBeInTheDocument();
    });
  });

  it("should render services from API", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    await user.click(screen.getByText(/Novo Agendamento/i));

    await waitFor(() => {
      const select = screen.getByLabelText(/selecione o serviço/i);
      expect(select).not.toBeDisabled();
      const options = Array.from(select.querySelectorAll("option")).map((o) => o.value);
      expect(options).toContain("Banho");
      expect(options).toContain("Tosa");
      expect(options).toContain("Banho e Tosa");
    });
  });

  it("should show loading state while fetching services", async () => {
    (getServices as jest.Mock).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    render(<Wrapper />);
    await user.click(screen.getByText(/Novo Agendamento/i));
    expect(screen.getByRole("option", { name: /Carregando serviços/i })).toBeInTheDocument();
  });

  it("should show error when fields are empty", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    await user.click(screen.getByText(/Novo Agendamento/i));
    await user.click(screen.getByRole("button", { name: /salvar agendamento/i }));
    expect(screen.getByText("Preencha todos os campos")).toBeInTheDocument();
  });

  it("should register new appointment successfully", async () => {
    (postAgenda as jest.Mock).mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<Wrapper />);
    await user.click(screen.getByText(/Novo Agendamento/i));
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /jesse/i })).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/selecione o cliente/i), "1");
    await user.selectOptions(screen.getByLabelText(/selecione o horário/i), "14:00");
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Banho —/i })).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/selecione o serviço/i), "Banho");
    await user.click(screen.getByRole("button", { name: /salvar agendamento/i }));
    expect(screen.getByText("Agendamento realizado com sucesso")).toBeInTheDocument();
    expect(postAgenda).toHaveBeenCalledTimes(1);
  });

  it("should mark occupied times as disabled", async () => {
    (getServices as jest.Mock).mockResolvedValue(mockServices);
    const user = userEvent.setup();
    render(<NewAppointmentModal {...propsNewAppointments} existingTimes={["10:00", "11:00"]} />);

    await waitFor(() => {
      const select = screen.getByLabelText(/selecione o serviço/i);
      expect(select).not.toBeDisabled();
    });
    await user.selectOptions(screen.getByLabelText(/selecione o serviço/i), "Banho");

    expect(screen.getByRole("option", { name: "10:00 - ocupado" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "11:00 - ocupado" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "09:00" })).not.toBeDisabled();
  });

  it("should show error when API fails", async () => {
    (postAgenda as jest.Mock).mockRejectedValue(new Error("Server error"));
    const user = userEvent.setup();
    render(<Wrapper />);
    await user.click(screen.getByText(/Novo Agendamento/i));
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /jesse/i })).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/selecione o cliente/i), "1");
    await user.selectOptions(screen.getByLabelText(/selecione o horário/i), "14:00");
    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Banho —/i })).toBeInTheDocument();
    });
    await user.selectOptions(screen.getByLabelText(/selecione o serviço/i), "Banho");
    await user.click(screen.getByRole("button", { name: /salvar agendamento/i }));
    expect(
      await screen.findByText("Erro ao criar agendamento, tente mais tarde"),
    ).toBeInTheDocument();
  });
});
