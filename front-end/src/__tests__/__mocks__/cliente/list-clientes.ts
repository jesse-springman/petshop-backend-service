export const mockClients = [
  {
    id: "1",
    customer_name: "jesse",
    pet_name: "cacau",
    created_at: "2025-12-30T14:48:03.026Z",
    address: "Rua mario azevedo n=14",
    number_customer: "19983350238",
    pet_beed: "vira-lata",
    last_bath: "2026-02-02T21:31:18.551Z",
  },
  {
    id: "2",
    customer_name: "maria",
    pet_name: "bolinha",
    created_at: "2025-12-31T10:20:00.000Z",
    address: "av luis-15 n=134",
    number_customer: "19993451232",
    pet_breed: "vira-lata",
    last_bath: "2026-01-28T21:31:18.551Z",
  },
  {
    id: "3",
    customer_name: "carlos",
    pet_name: "tom",
    created_at: "2025-12-31T10:20:00.000Z",
    address: "av luis-15 n=134",
    number_customer: "19993451232",
    pet_breed: "vira-lata",
    last_bath: "2026-01-28T21:31:18.551Z",
  },
];

// Test vazio só pra Jest não reclamar que a suite está vazia
test(" Mock Test", () => {
  expect(jest.fn()).toBeDefined();
});
