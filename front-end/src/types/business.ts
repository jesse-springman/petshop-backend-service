import { BusinessStatus } from "./statusBusiness";
import { Commerce } from "./commerce";

export type Business = {
  id: string;
  name: string;
  plan: string;
  commerce: Commerce;
  status: BusinessStatus;
  whatsapp: string;
  createdAt: string;
  users: { name: string }[];
};
