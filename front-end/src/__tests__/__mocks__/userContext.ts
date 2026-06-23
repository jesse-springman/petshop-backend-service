import { Commerce } from "../../types/commerce";

export const mockUserContext = {
  commerce: "PETSHOP" as Commerce,
  login: jest.fn(),
  logout: jest.fn(),
  userName: null,
  businessId: null,
  businessName: null,
  isAdmin: false,
  isSuperAdmin: false,
  loading: false,
};
