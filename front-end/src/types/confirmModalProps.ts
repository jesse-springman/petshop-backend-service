import { CommerceTheme } from "@/utils/Commercetheme";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  theme?: CommerceTheme;
  confirmLabel?: string;
  confirmDanger?: boolean;
}
