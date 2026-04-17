"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "../components/Calendar";
import { NewAppointmentModal } from "./NewAppointmentModal";
import { getAppointment } from "../services/agenda/get";
import { AppointmentType } from "../types/appointments";
import { DetailsAppointmentModal } from "./DetailsAppointmentModal";

export function AgendaPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectDate, setSelectDate] = useState<Date | null>(null);
  const [appointments, setAppointment] = useState<AppointmentType[]>([]);
  const [selectedDay, setSelectDay] = useState<Date | null>(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const selectedDayAppointments = selectedDay
    ? appointments.filter((a) => {
        const date = new Date(a.date);
        return (
          date.getDate() === selectedDay.getDate() && date.getMonth() === selectedDay.getMonth()
        );
      })
    : [];

  const appointmentsMap = useMemo(() => {
    const map: Record<string, AppointmentType[]> = {};

    appointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      if (!map[key]) map[key] = [];
      map[key].push(appointment);
    });

    return map;
  }, [appointments]);

  function handleInfoDay(day: Date) {
    setSelectDay(day);
  }

  function closeAll() {
    setSelectDay(null);
    setShowNewAppointment(false);
  }

  function nextMonth() {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newDate);
  }

  function prevMonth() {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newDate);
  }

  async function fetchAppointments() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const startParsed = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endParsed = `${year}-${String(month + 2).padStart(2, "0")}-01`;

    const data = await getAppointment(startParsed, endParsed);

    setAppointment(data);
    return data;
  }

  useEffect(() => {
    fetchAppointments();
  }, [currentMonth]);

  const existingTimes = selectedDayAppointments.map((a) =>
    new Date(a.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  );

  return (
    <div className="min-h-screen bg-[#080A0C] flex flex-col items-center pt-10 font-mono">
      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <button
          onClick={prevMonth}
          className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800/60 border border-zinc-700/50 hover:border-amber-500/50 hover:bg-zinc-700/60 text-zinc-400 hover:text-amber-400 transition-all duration-200"
        >
          ◀
        </button>

        <h1 className="text-lg font-semibold tracking-widest uppercase text-zinc-200 capitalize">
          {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </h1>

        <button
          onClick={nextMonth}
          className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800/60 border border-zinc-700/50 hover:border-amber-500/50 hover:bg-zinc-700/60 text-zinc-400 hover:text-amber-400 transition-all duration-200"
        >
          ▶
        </button>
      </div>

      <div
        className={`transition-all duration-300 ${selectDate ? "blur-sm scale-[0.99] pointer-events-none" : ""}`}
      >
        <Calendar
          appointmentsMap={appointmentsMap}
          monthDate={currentMonth}
          onDayClick={handleInfoDay}
        />
      </div>

      {selectedDay && !showNewAppointment && (
        <DetailsAppointmentModal
          date={selectedDay}
          appointments={selectedDayAppointments}
          onClose={closeAll}
          onNewAppointment={() => setShowNewAppointment(true)}
          onStatusChange={fetchAppointments}
        />
      )}

      {selectedDay && showNewAppointment && (
        <NewAppointmentModal
          dateSelect={selectedDay}
          onClose={closeAll}
          onSuccess={async () => {
            fetchAppointments();
            setShowNewAppointment(false);
          }}
          existingTimes={existingTimes}
        />
      )}
    </div>
  );
}
