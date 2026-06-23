import { render, screen, waitFor } from "@testing-library/react";
import { DetailsAppointmentModal } from "../../components/DetailsAppointmentModal";
import { mockUserContext } from "../__mocks__/userContext";
import { mockAppointment } from "../__mocks__/agenda/get-appointments";

jest.mock("@/context/UserContext", () => ({
  useUser: () => mockUserContext,
}));

describe("Modal Details", () => {
  it("Should show information pet ", () => {
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

    expect(screen.getByText("Rex")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
    expect(screen.getByText("Labrador")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Banho e Tosa")).toBeInTheDocument();
  });
});
