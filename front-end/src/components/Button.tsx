'use client';

type BtProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button({
  children,
  type = 'button',
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
      className="mb-5 bg-amber-500 text-black hover:bg-amber-400 px-8 py-4 rounded-2xl font-semibold transition cursor-pointer shadow-2xl [box-shadow:_0_10px_20px_rgba(0,0,0,0.9),_0_0_30px_rgba(0,0,0,0.8)] hover:[box-shadow:_0_30px_60px_rgba(0,0,0,0.25)]"
    >
      {' '}
      {children}
    </button>
  );
}
