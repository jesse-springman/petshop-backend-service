"use client";

import { useEffect, useState } from "react";
import { getClients } from "../services/customer/get";
import { Client, Pet, Vehicle } from "../types/clients";
import { useUser } from "@/context/UserContext";
import { commerceThemes } from "@/utils/Commercetheme";
import { Commerce } from "@/types/commerce";
import { ServiceType } from "@/types/serviceType";
import { getServices } from "@/services/servicesBusiness/get-service";
import toast from "react-hot-toast";
import { postAgenda } from "../services/agenda/post";

interface Props {
  dateSelect: Date;
  onClose: () => void;
  onSuccess: () => void;
  existingTimes?: string[];
}

export function NewAppointmentModal({ dateSelect, onClose, onSuccess, existingTimes }: Props) {
  const [customers, setCustomers] = useState<Client[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [customerId, setCustomerId] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const { commerce } = useUser();
  const currentCommerce = (commerce as Commerce) ?? "PETSHOP";
  const theme = commerceThemes[currentCommerce];

  const generateHours = () => {
    const hours = [];
    const now = new Date();
    const isToday = dateSelect.toDateString() === now.toDateString();
    const currentHours = now.getHours();

    for (let h = 8; h <= 18; h++) {
      if (isToday && h < currentHours) continue;
      const hour = `${String(h).padStart(2, "0")}:00`;
      hours.push({ value: hour, occupied: existingTimes?.includes(hour) });
    }

    return hours;
  };

  const hours = generateHours();

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [clientsData, servicesData] = await Promise.all([getClients(), getServices()]);
        if (!cancelled) {
          setCustomers(clientsData);
          setServices(servicesData.filter((s) => s.active)); // só serviços ativos
        }
      } catch {
        toast.error("Erro ao carregar dados");
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setDate(dateSelect.toLocaleDateString("en-CA"));
  }, [dateSelect]);

  function handleSelectCustomer(id: string) {
    setCustomerId(id);
    setSelectedPet(null);
    setSelectedVehicle(null);
    const client = customers.find((c) => c.id === id) ?? null;
    setSelectedClient(client);
  }

  async function handlerSubmit(e: React.FormEvent) {
    e.preventDefault();

    const dateTime = new Date(`${date}T${time}`);

    if (dateTime <= new Date()) {
      setMessage("Não é possível agendar em um horário que já passou");
      return;
    }

    if (existingTimes?.includes(time)) {
      setMessage("Esse horário já está ocupado");
      return;
    }

    if (!customerId || !time || !notes) {
      setMessage("Preencha todos os campos");
      return;
    }

    try {
      await postAgenda({
        customerId,
        date: dateTime.toISOString(),
        notes,
        petId: selectedPet?.id,
        vehicleId: selectedVehicle?.id,
      });

      toast.success("Agendamento criado");
      onSuccess();
      setMessage("Agendamento realizado com sucesso");
      setTimeout(() => onClose(), 2000);
    } catch {
      toast.error("Erro ao criar agendamento, tente mais tarde");
      setMessage("Erro ao criar agendamento, tente mais tarde");
    }
  }

  const selectClass = `cursor-pointer disabled:cursor-not-allowed w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-3 text-base text-zinc-200 focus:outline-none transition-all appearance-none`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div
        className="absolute top-0 left-8 right-8 h-[1px]"
        style={{
          background: `linear-gradient(to right, transparent, ${theme.primaryHex}60, transparent)`,
        }}
      />

      <div className="relative z-10 w-[570px] rounded-2xl border border-zinc-700/60 bg-zinc-900/95 shadow-2xl shadow-black/60 p-8 backdrop-blur-sm font-sans">
        <div
          className="absolute top-0 left-8 right-8 h-[1px]"
          style={{
            background: `linear-gradient(to right, transparent, ${theme.primaryHex}60, transparent)`,
          }}
        />
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-sm"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: theme.primaryHex }}>
          Novo Agendamento
        </h2>
        <p className="text-sm text-zinc-500 uppercase tracking-widest mb-6">
          {dateSelect.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="border-t border-zinc-800 mb-5" />

        <form noValidate onSubmit={handlerSubmit} className="flex flex-col gap-3">
          {/* Cliente */}
          <label htmlFor="select-client" className="sr-only">
            Selecione o cliente
          </label>
          <select
            id="select-client"
            value={customerId}
            onChange={(e) => handleSelectCustomer(e.target.value)}
            className={selectClass}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${theme.primaryHex}60`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)")}
            required
          >
            <option value="" className="text-zinc-400 bg-zinc-900">
              {currentCommerce === "PETSHOP"
                ? "🐾 Selecione o cliente"
                : currentCommerce === "AUTOMOTIVE"
                  ? "🚗 Selecione o cliente"
                  : "💅 Selecione a cliente"}
            </option>
            {customers.map((c) => (
              <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-200">
                {c.name}
              </option>
            ))}
          </select>

          {/* Pet (só PETSHOP) */}
          {currentCommerce === "PETSHOP" &&
            selectedClient &&
            (selectedClient.pets?.length ?? 0) > 0 && (
              <>
                <label htmlFor="select-pet" className="sr-only">
                  Selecione o pet
                </label>
                <select
                  id="select-pet"
                  onFocus={(e) => (e.currentTarget.style.borderColor = `${theme.primaryHex}60`)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)")}
                  value={selectedPet?.id ?? ""}
                  onChange={(e) => {
                    const pet = selectedClient.pets.find((p) => p.id === e.target.value) ?? null;
                    setSelectedPet(pet);
                  }}
                  className={selectClass}
                >
                  <option value="" className="text-zinc-400 bg-zinc-900">
                    🐶 Selecione o pet
                  </option>
                  {selectedClient.pets.map((p) => (
                    <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-200">
                      {p.name} {p.breed ? `(${p.breed})` : ""}
                    </option>
                  ))}
                </select>
              </>
            )}

          {/* Veículo (só AUTOMOTIVE) */}
          {currentCommerce === "AUTOMOTIVE" &&
            selectedClient &&
            (selectedClient.vehicles?.length ?? 0) > 0 && (
              <>
                <label htmlFor="select-vehicle" className="sr-only">
                  Selecione o veículo
                </label>
                <select
                  id="select-vehicle"
                  onFocus={(e) => (e.currentTarget.style.borderColor = `${theme.primaryHex}60`)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)")}
                  value={selectedVehicle?.id ?? ""}
                  onChange={(e) => {
                    const vehicle =
                      selectedClient.vehicles.find((v) => v.id === e.target.value) ?? null;
                    setSelectedVehicle(vehicle);
                  }}
                  className={selectClass}
                >
                  <option value="" className="text-zinc-400 bg-zinc-900">
                    🚗 Selecione o veículo
                  </option>
                  {selectedClient.vehicles.map((v) => (
                    <option key={v.id} value={v.id} className="bg-zinc-900 text-zinc-200">
                      {v.brand} {v.model} {v.plate ? `— ${v.plate}` : ""}
                    </option>
                  ))}
                </select>
              </>
            )}

          {/* Data e hora */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="cursor-pointer w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-3 text-base text-zinc-300 focus:outline-none transition-all"
              onFocus={(e) => (e.currentTarget.style.borderColor = `${theme.primaryHex}60`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)")}
              required
            />
            <label htmlFor="select-horario" className="sr-only">
              Selecione o Horário
            </label>
            <select
              id="select-horario"
              onFocus={(e) => (e.currentTarget.style.borderColor = `${theme.primaryHex}60`)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)")}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={selectClass}
              required
            >
              <option value="" className="bg-zinc-900 text-zinc-400">
                Selecione o Horário
              </option>
              {hours.map(({ value, occupied }) => (
                <option
                  key={value}
                  value={value}
                  disabled={occupied}
                  className="bg-zinc-900 text-zinc-200"
                >
                  {value} {occupied ? "- ocupado" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Serviços do banco */}
          <label htmlFor="select-servico" className="sr-only">
            Selecione o Serviço
          </label>
          <select
            id="select-servico"
            value={notes}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${theme.primaryHex}60`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)")}
            onChange={(e) => setNotes(e.target.value)}
            className={selectClass}
            disabled={loadingServices}
            required
          >
            <option value="" className="bg-zinc-900 text-zinc-400">
              {loadingServices ? "Carregando serviços..." : "Selecione o serviço"}
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.name} className="bg-zinc-900 text-zinc-200">
                {s.name} —{" "}
                {Number(s.price).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </option>
            ))}
          </select>

          {/* Mensagem de erro/sucesso */}
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
            className="cursor-pointer mt-1 w-full font-bold text-sm py-2.5 rounded-lg transition-all duration-200 tracking-wide"
            style={{ background: theme.primaryHex, color: "#000" }}
          >
            Salvar agendamento
          </button>
        </form>
      </div>
    </div>
  );
}
