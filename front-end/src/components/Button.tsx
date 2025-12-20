"use client";


type BtProps = {
    children: React.ReactNode
};

export default function Button({children}: BtProps) {
    return(
        <button className="bg-amber-500 text-black hover:bg-amber-400 px-8 py-4 rounded-lg font-semibold transition" >
            {children}
        </button>
    )
}
