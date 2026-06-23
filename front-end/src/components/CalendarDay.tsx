import { PropsDate } from "../types/propDate";
import { Commerce } from "@/types/commerce";
import { useUser } from "@/context/UserContext";

const commerceEmoji: Record<Commerce, string> = {
  PETSHOP: "🐾",
  AUTOMOTIVE: "🚗",
  FEMININE_AESTHETIC: "💅",
};

export function CalendarDay({ day, appointments, onClick, primaryHex }: PropsDate) {
  const { commerce } = useUser();
  const emoji = commerceEmoji[(commerce ?? "PETSHOP") as Commerce];
  const isToday = day.toDateString() === new Date().toDateString();

  return (
    <div
      onClick={onClick}
      className={`
        group relative min-h-[80px] sm:min-h-[110px] rounded-xl p-1 sm:p-2.5 cursor-pointer
        border transition-all duration-200 flex flex-col w-full overflow-hidden
      `}
      style={{
        borderColor: isToday ? `${primaryHex}60` : "rgba(39,39,42,0.8)",
        background: isToday ? `${primaryHex}08` : "rgba(24,24,27,0.5)",
        boxShadow: isToday ? `0 0 12px ${primaryHex}15` : "none",
      }}
      onMouseEnter={(e) => {
        if (!isToday) e.currentTarget.style.borderColor = "rgba(82,82,91,0.6)";
      }}
      onMouseLeave={(e) => {
        if (!isToday) e.currentTarget.style.borderColor = "rgba(39,39,42,0.8)";
      }}
    >
      <div
        className="text-[10px] sm:text-xs font-bold mb-1 sm:mb-2 self-start px-1 py-0.5 rounded-md transition-colors"
        style={isToday ? { background: primaryHex, color: "#000" } : { color: "rgb(113,113,122)" }}
      >
        {day.getDate()}
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {appointments.length > 0 && (
          <div>
            <h2 className="text-center text-sm sm:text-lg">{emoji}</h2>
            <p
              className="hidden sm:block text-center line-clamp-2 text-lg rounded-md px-1.5 py-1 font-sans"
              style={{
                background: `${primaryHex}10`,
                border: `1px solid ${primaryHex}20`,
                color: `${primaryHex}cc`,
              }}
            >
              {appointments.length} agend.
            </p>
            <p
              className="sm:hidden text-center text-[10px] rounded-md px-1 py-0.5"
              style={{
                background: `${primaryHex}10`,
                border: `1px solid ${primaryHex}20`,
                color: `${primaryHex}cc`,
              }}
            >
              {appointments.length}
            </p>
          </div>
        )}
      </div>

      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ring-1 ring-inset ring-zinc-600/30" />
    </div>
  );
}
