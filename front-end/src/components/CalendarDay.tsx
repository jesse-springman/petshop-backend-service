import { PropsDate } from "../types/propDate";

export function CalendarDay({ day, appointments, onClick }: PropsDate) {
  const isToday = day.toDateString() === new Date().toDateString();

  return (
    <div
      onClick={onClick}
      className={`
        group relative min-h-[80px] sm:min-h-[110px] rounded-xl p-1 sm:p-2.5 cursor-pointer
        border transition-all duration-200 flex flex-col w-full
        ${
          isToday
            ? "border-amber-500/60 bg-amber-500/5 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
            : "border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-600/60 hover:bg-zinc-800/40"
        }
      `}
    >
      <div
        className={`
          text-[10px] sm:text-xs font-bold mb-1 sm:mb-2 self-start px-1 py-0.5 rounded-md
          ${isToday ? "bg-amber-500 text-black" : "text-zinc-500 group-hover:text-zinc-300"}
        `}
      >
        {day.getDate()}
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {appointments.length > 0 && (
          <div>
            <h2 className="text-center text-sm sm:text-2xl">🐶</h2>
            <p className="hidden sm:block text-center line-clamp-2 text-lg bg-amber-500/10 border border-amber-500/20 rounded-md px-1.5 py-1 text-amber-300/80 font-sans">
              {appointments.length} Pets Agendados
            </p>
            {/* versão mobile — só o número */}
            <p className="sm:hidden text-center text-[10px] bg-amber-500/10 border border-amber-500/20 rounded-md px-1 py-0.5 text-amber-300/80">
              {appointments.length}
            </p>
          </div>
        )}
      </div>

      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ring-1 ring-inset ring-zinc-600/30" />
    </div>
  );
}
