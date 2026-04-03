const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = String(today.getMonth() + 1).padStart(2, "0");

export const mockAppointment = {
  id: "appointment-uuid-1",
  customerId: "uuid-1",
  userId: "user1",
  date: `${currentYear}-${currentMonth}-15T10:00:00`,
  status: "SCHEDULED" as const,
  notes: "Banho e Tosa",
  created_at: `${currentYear}- ${currentMonth}-01T08:00:00`,
  customer: {
    id: "uuid-1",
    customer_name: "Joao Silva",
    pet_name: "Rex",
    pet_breed: "Labrador",
  },
};

// Test vazio só pra Jest não reclamar que a suite está vazia
test(" Mock Test", () => {
  expect(jest.fn()).toBeDefined();
});
