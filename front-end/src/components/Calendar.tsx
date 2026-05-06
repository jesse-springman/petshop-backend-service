import { CalendarDay } from "./CalendarDay";
import { getMonthDays } from "../utils/calendar";
import { AppointmentType } from "../types/appointments";
import { useRouter } from "next/navigation";

interface Props {
  appointmentsMap: Record<string, AppointmentType[]>;
  monthDate: Date;
  onDayClick: (day: Date) => void;
  // onAppointmentClick: (appointments: AppointmentType[], date: Date) => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function Calendar({ monthDate, appointmentsMap, onDayClick }: Props) {
  const router = useRouter();

  const days = getMonthDays(monthDate);

  return (
    <div className="px-2 sm:px-4 pb-10 w-full">
      <button
        onClick={() => router.push("/")}
        className="fixed top-5 left-5 z-50 px-4 py-2 rounded-xl text-sm font-semibold border border-zinc-700/60 bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all cursor-pointer"
      >
        ← Voltar
      </button>

      <div className="grid grid-cols-7 mb-2 gap-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] sm:text-sm font-semibold tracking-widest uppercase text-zinc-600 py-2"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-3">
        {days.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} />;

          const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
          const dayAppointments = appointmentsMap[key] || [];

          return (
            <CalendarDay
              key={day.toISOString()}
              day={day}
              appointments={dayAppointments}
              onClick={() => onDayClick(day)}
            />
          );
        })}
      </div>
    </div>
  );
}
