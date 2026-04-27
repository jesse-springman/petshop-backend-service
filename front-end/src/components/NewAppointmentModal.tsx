"use client";

import { useEffect, useState } from "react";
import { getClients } from "../services/customer/get";
import { Client } from "../types/clients";
import toast from "react-hot-toast";
import { postAgenda } from "../services/agenda/post";

interface Props {
  dateSelect: Date;
  onClose: () => void;
  onSuccess: () => void;
  existingTimes?: string[];
}

export function NewAppointmentModal({ dateSelect, onClose, onSuccess, existingTimes }: Props) {
  const [customers, setCustomer] = useState<Client[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const generateHours = () => {
    const hours = [];
    const now = new Date();
    const isToday = dateSelect.toDateString() === now.toDateString();
    const currentHours = now.getHours();

    for (let h = 8; h <= 18; h++) {
      if (isToday && h < currentHours) continue;

      const hour = `${String(h).padStart(2, "0")}:00`;

      const isOccupied = existingTimes?.includes(hour);

      hours.push({ value: hour, occupied: isOccupied });
    }

    return hours;
  };

  const hours = generateHours();
  const services = ["Banho", "Tosa", "Banho e Tosa", "Hidratação", "Corte de unha"];

  useEffect(() => {
    let cancelled = false;

    async function loadCustomers() {
      const data = await getClients();

      if (!cancelled) {
        setCustomer(data);
      }
    }

    loadCustomers();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const formatDate = dateSelect.toLocaleDateString("en-CA");
    setDate(formatDate);
  }, [dateSelect]);

  async function handlerSubmit(e: React.FormEvent) {
    e.preventDefault();

    const dateTime = new Date(`${date}T${time}`);

    const now = new Date();
    if (dateTime <= now) {
      setMessage("Não é possível agendar em um horário que já passou");
      return;
    }

    if (existingTimes?.includes(time)) {
      setMessage("Esse horário já esta ocupado");
      return;
    }

    if (!customerId || !dateTime || !notes) {
      setMessage("Preencha todos os campos");
      return;
    }

    try {
      await postAgenda({
        customerId,
        date: dateTime.toISOString(),
        notes,
      });

      toast.success("Agendamento criado");
      onSuccess();
      setMessage("Agendamento realizado com sucesso");
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      toast.error("Erro ao criar agendamento, tente mais tarde");
      setMessage("Erro ao criar agendamento, tente mais tarde");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-[570px] rounded-2xl border border-zinc-700/60 bg-zinc-900/95 shadow-2xl shadow-black/60 p-8 backdrop-blur-sm">
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-sm"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-amber-400 tracking-tight mb-1">Novo Agendamento</h2>

        <p className="text-sm  text-zinc-500 uppercase tracking-widest mb-6">
          {dateSelect.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="border-t border-zinc-800 mb-5" />

        <form noValidate onSubmit={handlerSubmit} className="flex flex-col gap-3">
          <label htmlFor="select-pet" className="sr-only">
            Selecione o pet
          </label>
          <select
            id="select-pet"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="cursor-pointer w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-3 
             font-[family-name:var(--font-sans)] text-base text-zinc-200 
             focus:outline-none focus:border-amber-500/60 focus:bg-zinc-800 transition-all appearance-none"
            required
          >
            <option
              value=""
              className="font-[family-name:var(--font-sans)] text-zinc-400 bg-zinc-900"
            >
              🐾 Selecione o pet
            </option>
            {customers.map((c) => (
              <option
                key={c.id}
                value={c.id}
                className="font-[family-name:var(--font-sans)] bg-zinc-900 text-zinc-200"
              >
                🐶 {c.pet_name} ({c.pet_breed}) — {c.customer_name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="cursor-pointer w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-3 text-base text-zinc-300 focus:outline-none focus:border-amber-500/60 transition-all"
              required
            />

            <label htmlFor="select-horario" className="sr-only">
              Selecione o Horário
            </label>
            <select
              id="select-horario"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="cursor-pointer w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-3 
             font-[family-name:var(--font-sans)] text-base text-zinc-200 
             focus:outline-none focus:border-amber-500/60 focus:bg-zinc-800 transition-all appearance-none"
              required
            >
              <option
                value=""
                className="font-[family-name:var(--font-sans)] bg-zinc-900 text-zinc-400"
              >
                Selecione o Horário:
              </option>
              {hours.map(({ value, occupied }) => (
                <option
                  key={value}
                  value={value}
                  disabled={occupied}
                  className="font-[family-name:var(--font-mono)] bg-zinc-900 text-zinc-200"
                >
                  {value} {occupied ? "- ocupado" : ""}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor="select-servico" className="sr-only">
            Selecione o Serviço
          </label>
          <select
            id="select-servico"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="cursor-pointer w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-3 
             font-[family-name:var(--font-sans)] text-base text-zinc-200 
             focus:outline-none focus:border-amber-500/60 focus:bg-zinc-800 transition-all appearance-none"
            required
          >
            <option value="">🐾 Selecione o Serviço</option>
            {services.map((service) => (
              <option
                key={service}
                value={service}
                className="cursor-pointer w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-3 
             font-[family-name:var(--font-sans)] text-base text-zinc-200 
             focus:outline-none focus:border-amber-500/60 focus:bg-zinc-800 transition-all appearance-none"
              >
                {service}
              </option>
            ))}
          </select>

          {message && (
            <p
              className={`text-center text-lg ${
                message.includes("sucesso") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="cursor-pointer mt-1 w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-bold text-sm py-2.5 rounded-lg transition-all duration-200 tracking-wide"
          >
            Salvar agendamento
          </button>
        </form>
      </div>
    </div>
  );
}
