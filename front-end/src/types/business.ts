import { BusinessStatus } from "./statusBusiness";

export type Business = {
  id: string;
  name: string;
  plan: string;
  status: BusinessStatus;
  whatsapp: string;
  createdAt: string;
  users: { name: string }[];
};
