"use client";

type BtProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button({
  children,
  type = "button",
  disabled = false,
  onClick,
  ...rest
}: BtProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...rest}
      className="group mb-5 px-7 py-4 text-base relative px-5 py-2.5 rounded-xl
                        border border-amber-500/40 bg-amber-500/5
                        text-amber-300 text-sm font-semibold tracking-wide
                        hover:bg-amber-500 hover:text-black hover:border-amber-500
                        transition-all duration-200
                        shadow-[0_0_12px_rgba(245,158,11,0.08)]
                        hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]
                        whitespace-nowrap cursor-pointer
                      "
    >
      {children}
    </button>
  );
}
