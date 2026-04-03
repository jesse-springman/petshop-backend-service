import { CalendarDay } from "./CalendarDay";
import { getMonthDays } from "../utils/calendar";
import { AppointmentType } from "../types/appointments";

interface Props {
  appointmentsMap: Record<string, AppointmentType[]>;
  monthDate: Date;
  onDayClick: (day: Date) => void;
  // onAppointmentClick: (appointments: AppointmentType[], date: Date) => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function Calendar({ monthDate, appointmentsMap, onDayClick }: Props) {
  const days = getMonthDays(monthDate);

  return (
    <div className="px-6 pb-10 w-full max-w-7xl">
      <div className="grid grid-cols-7 mb-2 gap-5">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-base font-semibold tracking-widest uppercase text-zinc-600 py-2"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7  gap-17 ">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }

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
