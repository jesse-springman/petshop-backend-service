import { render, screen, waitFor } from "@testing-library/react";
import { DetailsAppointmentModal } from "../../components/DetailsAppointmentModal";
import userEvent from "@testing-library/user-event";
import { mockAppointment } from "../__mocks__/agenda/get-appointments";

describe("Modal Details", () => {
  it("Should show information pet ", () => {
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
    expect(screen.getByText("Joao Silva")).toBeInTheDocument();
    expect(screen.getByText("Banho e Tosa")).toBeInTheDocument();
  });

  //   render(
  //     <DetailsAppointmentModal
  //       date={new Date("2026-03-21")}
  //       appointments={[mockAppointment]}
  //       onClose={jest.fn()}
  //       onNewAppointment={jest.fn()}
  //       onStatusChange={jest.fn()}
  //     />,
  //   );

  // });
});
