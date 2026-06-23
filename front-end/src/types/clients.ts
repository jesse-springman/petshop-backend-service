export type Pet = {
  id: string;
  name: string;
  breed: string | null;
  lastBath: string | null;
  customerId: string;
  createdAt: string;
};

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  plate: string | null;
  customerId: string;
  createdAt: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  businessId: string;
  pets: Pet[];
  vehicles: Vehicle[];
};
