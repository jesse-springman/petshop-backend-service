"use client";
import { ArrowRight } from "lucide-react";

type ActionCardProps = {
  title: string;
  description: string;
  icon?: string;
  onClick?: () => void;
};

export function ActionCard({ title, description, icon, onClick }: ActionCardProps) {
  return (
    <div
      onClick={onClick}
      className="
            bg-[#000000] border border-amber-500/20 hover:border-amber-500/60 
           hover: transition-all duration-200 rounded-2xl p-6 
           cursor-pointer group
  "
    >
      <div>{icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="text-yellow-400 font-bold text-lg leading-tight">{title}</h3>
        <p className="text-gray-400 text-lg mt-1 leading-relaxed">{description}</p>
      </div>
      <ArrowRight
        className="text-gray-600 group-hover:text-amber-400 transition-all shrink-0"
        size={16}
      />
    </div>
  );
}
