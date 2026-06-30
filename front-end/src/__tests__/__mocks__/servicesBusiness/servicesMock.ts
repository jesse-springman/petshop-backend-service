import { ServiceType } from "@/types/serviceType";

export const mockServices: ServiceType[] = [
  {
    id: "service-uuid-1",
    name: "Banho",
    price: 40.0,
    active: true,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "service-uuid-2",
    name: "Tosa",
    price: 60.0,
    active: true,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "service-uuid-3",
    name: "Banho e Tosa",
    price: 90.0,
    active: true,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];
