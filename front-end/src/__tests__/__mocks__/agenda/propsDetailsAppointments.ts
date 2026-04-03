import { mockAppointment } from "./get-appointments";

export const propsDetailsModal = {
  date: new Date("2026-03-21"),
  appointments: [mockAppointment],
  onClose: jest.fn(),
  onNewAppointment: jest.fn(),
  onStatusChange: jest.fn(),
};
