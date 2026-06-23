import { Plan } from "./plan";
import { Commerce } from "./commerce";

export interface BusinessDto {
  businessName: string;
  adiminName: string;
  password: string;
  plan: Plan;
  commerce: Commerce;
  whatsapp: string;
}
