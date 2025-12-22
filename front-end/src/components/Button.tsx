"use client";


type BtProps = {
    children: React.ReactNode;
    type?:"button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button({
    children,
    type="button",
    disabled= false,
    onClick,
    ...rest}: BtProps) {

    return(
        <button type={type}
        disabled={disabled}
        onClick={onClick}
        {...rest}
        className=" mb-5 bg-amber-500 text-black hover:bg-amber-400 px-8 py-4 rounded-2xl font-semibold transition cursor-pointer"
        >  {children}
        </button>
    );
}
