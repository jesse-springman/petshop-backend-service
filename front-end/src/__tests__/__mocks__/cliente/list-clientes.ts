import { Client } from "../../../types/clients";

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Jesse",
    phone: "19983350238",
    address: "Rua Mario Azevedo n=14",
    createdAt: "2025-12-30T14:48:03.026Z",
    businessId: "business-uuid-1",
    pets: [
      {
        id: "pet-uuid-1",
        name: "Cacau",
        breed: "Vira-lata",
        lastBath: "2026-02-02T21:31:18.551Z",
        customerId: "1",
        createdAt: "2025-12-30T14:48:03.026Z",
      },
    ],
    vehicles: [],
  },
  {
    id: "2",
    name: "Maria",
    phone: "19993451232",
    address: "Av Luis-15 n=134",
    createdAt: "2025-12-31T10:20:00.000Z",
    businessId: "business-uuid-1",
    pets: [
      {
        id: "pet-uuid-2",
        name: "Bolinha",
        breed: "Vira-lata",
        lastBath: "2026-01-28T21:31:18.551Z",
        customerId: "2",
        createdAt: "2025-12-31T10:20:00.000Z",
      },
    ],
    vehicles: [],
  },
  {
    id: "3",
    name: "Carlos",
    phone: "19993451232",
    address: "Av Luis-15 n=134",
    createdAt: "2025-12-31T10:20:00.000Z",
    businessId: "business-uuid-1",
    pets: [
      {
        id: "pet-uuid-3",
        name: "Tom",
        breed: "Vira-lata",
        lastBath: "2026-01-28T21:31:18.551Z",
        customerId: "3",
        createdAt: "2025-12-31T10:20:00.000Z",
      },
    ],
    vehicles: [],
  },
];
