"use client";

type BtProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  onNavigate?: () => void;
  primaryHex?: string;
};

export default function Button({
  children,
  type = "button",
  disabled = false,
  onClick,
  onNavigate,
  primaryHex = "#fbbf24", // amber como fallback
  ...rest
}: BtProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="group mb-5 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer"
      style={{
        border: `1px solid ${primaryHex}40`,
        background: `${primaryHex}08`,
        color: primaryHex,
        boxShadow: `0 0 12px ${primaryHex}10`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = primaryHex;
        e.currentTarget.style.color = "#000";
        e.currentTarget.style.boxShadow = `0 0 20px ${primaryHex}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `${primaryHex}08`;
        e.currentTarget.style.color = primaryHex;
        e.currentTarget.style.boxShadow = `0 0 12px ${primaryHex}10`;
      }}
    >
      {children}
    </button>
  );
}
