import { AgendaPage } from "../../components/AgendaPage";
import { render, screen, waitFor } from "@testing-library/react";
import { getAppointment } from "../../services/agenda/get";
import { getClients } from "../../services/customer/get";
import {
  mockAppointment,
  mockAppointmentAutomotive,
  mockAppointmentFeminine,
} from "../__mocks__/agenda/get-appointments";
import userEvent from "@testing-library/user-event";
import { mockUserContext } from "../__mocks__/userContext";

jest.mock("@/context/UserContext", () => ({
  useUser: () => mockUserContext,
}));

jest.mock("../../services/agenda/get", () => ({
  getAppointment: jest.fn(),
}));

jest.mock("../../services/customer/get", () => ({
  getClients: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

function setCommerce(commerce: "PETSHOP" | "AUTOMOTIVE" | "FEMININE_AESTHETIC") {
  mockUserContext.commerce = commerce;
}

describe("GET / agenda", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setCommerce("PETSHOP");
  });

  it("should render the calendar", async () => {
    (getAppointment as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<AgendaPage />);
    await waitFor(() => {
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
  });

  it("should render the seven days of week", async () => {
    (getAppointment as jest.Mock).mockResolvedValue([]);
    render(<AgendaPage />);
    await waitFor(() => {
      ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach((day) => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });
  });

  it("should show calendar empty when no appointments", async () => {
    (getAppointment as jest.Mock).mockResolvedValue([]);
    render(<AgendaPage />);
    await waitFor(() => {
      expect(screen.queryByText(/agend\./i)).not.toBeInTheDocument();
    });
  });

  // ── PETSHOP ──
  describe("PETSHOP", () => {
    beforeEach(() => setCommerce("PETSHOP"));

    it("should show appointment on correct day", async () => {
      (getAppointment as jest.Mock).mockResolvedValue([mockAppointment]);
      render(<AgendaPage />);
      await waitFor(() => {
        expect(screen.getByText("1 agend.")).toBeInTheDocument();
      });
    });

    it("should show customer details when clicking on day", async () => {
      (getAppointment as jest.Mock).mockResolvedValue([mockAppointmentFeminine]);
      (getClients as jest.Mock).mockResolvedValue([]);
      render(<AgendaPage />);
      const user = userEvent.setup();
      const day = await screen.findByText("1 agend.");
      await user.click(day);

      const anaLimaElements = await screen.findAllByText("Ana Lima");
      expect(anaLimaElements.length).toBeGreaterThan(0);
    });

    it("should show Novo Agendamento button and pet select", async () => {
      (getAppointment as jest.Mock).mockResolvedValue([mockAppointment]);
      (getClients as jest.Mock).mockResolvedValue([]);
      render(<AgendaPage />);
      const user = userEvent.setup();
      const day = await screen.findByText("1 agend.");
      await user.click(day);
      await user.click(await screen.findByText(/Novo Agendamento/i));
      await waitFor(() => {
        expect(screen.getByLabelText(/Selecione o cliente/i)).toBeInTheDocument();
      });
    });
  });

  // ── AUTOMOTIVE ──
  describe("AUTOMOTIVE", () => {
    beforeEach(() => setCommerce("AUTOMOTIVE"));

    it("should show appointment on correct day", async () => {
      (getAppointment as jest.Mock).mockResolvedValue([mockAppointmentAutomotive]);
      render(<AgendaPage />);
      await waitFor(() => {
        expect(screen.getByText("1 agend.")).toBeInTheDocument();
      });
    });

    it("should show vehicle details when clicking on day", async () => {
      (getAppointment as jest.Mock).mockResolvedValue([mockAppointmentAutomotive]);
      (getClients as jest.Mock).mockResolvedValue([]);
      render(<AgendaPage />);
      const user = userEvent.setup();
      const day = await screen.findByText("1 agend.");
      await user.click(day);
      expect(await screen.findByText(/Toyota/i)).toBeInTheDocument();
    });

    it("should show Novo Agendamento button and vehicle select", async () => {
      (getAppointment as jest.Mock).mockResolvedValue([mockAppointmentAutomotive]);
      (getClients as jest.Mock).mockResolvedValue([]);
      render(<AgendaPage />);
      const user = userEvent.setup();
      const day = await screen.findByText("1 agend.");
      await user.click(day);
      await user.click(await screen.findByText(/Novo Agendamento/i));
      await waitFor(() => {
        expect(screen.getByLabelText(/Selecione o serviço/i)).toBeInTheDocument();
      });
    });
  });

  // ── FEMININE_AESTHETIC ──
  describe("FEMININE_AESTHETIC", () => {
    beforeEach(() => setCommerce("FEMININE_AESTHETIC"));

    it("should show appointment on correct day", async () => {
      (getAppointment as jest.Mock).mockResolvedValue([mockAppointmentFeminine]);
      render(<AgendaPage />);
      await waitFor(() => {
        expect(screen.getByText("1 agend.")).toBeInTheDocument();
      });
    });

    it("should show customer details when clicking on day", async () => {
      (getAppointment as jest.Mock).mockResolvedValue([mockAppointmentFeminine]);
      (getClients as jest.Mock).mockResolvedValue([]);
      render(<AgendaPage />);
      const user = userEvent.setup();
      const day = await screen.findByText("1 agend.");
      await user.click(day);
      const anaLimaElements = await screen.findAllByText("Ana Lima");
      expect(anaLimaElements.length).toBeGreaterThan(0);
    });
  });
});
