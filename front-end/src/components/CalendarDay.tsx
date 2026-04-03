import { PropsDate } from "../types/propDate";
import { AppointmentStatus, statusConfig } from "../utils/appointmentsStatus";

export function CalendarDay({ day, appointments, onClick }: PropsDate) {
  const isToday = day.toDateString() === new Date().toDateString();

  return (
    <div
      onClick={onClick}
      className={`
        group relative min-h-[110px] h-45rounded-xl p-2.5 cursor-pointer
        border transition-all duration-200 flex flex-col w-40
        ${
          isToday
            ? "border-amber-500/60 bg-amber-500/5 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
            : "border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-600/60 hover:bg-zinc-800/40"
        }
      `}
    >
      {/* Número do dia */}
      <div
        className={`
        text-xs font-bold mb-2 self-start px-1.5 py-0.5 rounded-md
        ${isToday ? "bg-amber-500 text-black" : "text-zinc-500 group-hover:text-zinc-300"}
      `}
      >
        {day.getDate()}
      </div>

      {/* Agendamentos */}
      <div className="cursor-pointer flex flex-col gap-1 flex-1">
        {appointments.length > 0 && (
          <div>
            <h2 className="text-center text-2xl">🐶</h2>
            <p className="text-center line-clamp-2 text-lg bg-amber-500/10 border border-amber-500/20 rounded-md px-1.5 py-1 text-amber-300/80">
              {appointments.length} Pets Agendados
            </p>
          </div>
        )}
      </div>

      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ring-1 ring-inset ring-zinc-600/30" />
    </div>
  );
}
