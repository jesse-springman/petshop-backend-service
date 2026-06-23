"use client";

import { AppointmentType } from "../types/appointments";
import { AppointmentStatus, statusConfig } from "@/utils/appointmentsStatus";
import { useUser } from "@/context/UserContext";
import { Commerce } from "@/types/commerce";
import Button from "../components/Button";
import { patchAppointments } from "../services/agenda/patch";
import { useState } from "react";
import { deleteAppointment } from "../services/agenda/delete";
import toast from "react-hot-toast";
import ConfirmModal from "./confimModal";
import { commerceThemes } from "@/utils/Commercetheme";

interface Props {
  date: Date;
  appointments: AppointmentType[];
  onClose: () => void;
  onNewAppointment: () => void;
  onStatusChange: () => Promise<void>;
}

export function DetailsAppointmentModal({
  date,
  appointments,
  onClose,
  onNewAppointment,
  onStatusChange,
}: Props) {
  const [editngId, setEditingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    customerName: string;
  } | null>(null);

  const { commerce } = useUser();
  const currentCommerce = (commerce as Commerce) ?? "PETSHOP";
  const theme = commerceThemes[currentCommerce];

  async function handleStatusChange(idAppointment: string, status: AppointmentStatus) {
    try {
      const response = await patchAppointments(idAppointment, status);
      if (response.ok) {
        await onStatusChange();
        setEditingId(null);
      }
    } finally {
      setLoadingId(null);
    }
  }

  async function handlerDelete(id: string, customerName: string) {
    try {
      const response = await deleteAppointment(id);
      if (response.ok) await onStatusChange();
      toast.success(`Agendamento de ${customerName} foi excluído`);
    } catch {
      toast.error(`Falha ao excluir o agendamento de ${customerName}`);
    }
  }

  function getAppointmentIcon() {
    if (currentCommerce === "AUTOMOTIVE") return "🚗";
    if (currentCommerce === "FEMININE_AESTHETIC") return "💅";
    return "🐶";
  }

  function getAppointmentTitle(a: AppointmentType) {
    if (currentCommerce === "PETSHOP" && a.pet) {
      return (
        <>
          <span className="text-xl font-bold text-zinc-100">{a.pet.name}</span>
          {a.pet.breed && (
            <span className="text-lg text-zinc-500 border border-zinc-700 rounded-full px-2 py-0.5">
              {a.pet.breed}
            </span>
          )}
        </>
      );
    }

    if (currentCommerce === "AUTOMOTIVE" && a.vehicle) {
      return (
        <span className="text-xl font-bold text-zinc-100">
          {a.vehicle.brand} {a.vehicle.model}
          {a.vehicle.plate && (
            <span className="text-lg text-zinc-500 border border-zinc-700 rounded-full px-2 py-0.5 ml-2">
              {a.vehicle.plate}
            </span>
          )}
        </span>
      );
    }

    return <span className="text-xl font-bold text-zinc-100">{a.customer.name}</span>;
  }

  function getCustomerLabel() {
    if (currentCommerce === "AUTOMOTIVE") return "Cliente";
    if (currentCommerce === "FEMININE_AESTHETIC") return "Cliente";
    return "Tutor";
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

        <div
          className="absolute top-0 left-8 right-8 h-[1px]"
          style={{
            background: `linear-gradient(to right, transparent, ${theme.primaryHex}60, transparent)`,
          }}
        />

        <div className="relative z-10 w-[560px] max-h-[80vh] flex flex-col rounded-2xl border border-zinc-700/60 bg-zinc-900/95 shadow-2xl shadow-black/60 backdrop-blur-sm font-sans">
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

          <div className="p-8 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-sm"
            >
              ✕
            </button>

            <h2
              className="text-2xl font-bold tracking-tight mb-1"
              style={{ color: theme.primaryHex }}
            >
              Agendamentos do dia
            </h2>

            <p className="text-sm text-zinc-500 uppercase tracking-widest">
              {date.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="border-t border-zinc-800 mt-4" />
          </div>

          <div className="overflow-y-auto flex-1 px-8 pb-8 flex flex-col gap-3">
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                <span className="text-4xl mb-3">{getAppointmentIcon()}</span>
                <p className="text-sm tracking-wide">Nenhum agendamento neste dia</p>
              </div>
            ) : (
              appointments.map((a) => {
                const status = statusConfig[a.status];
                const isEditing = editngId === a.id;
                const isLoading = loadingId === a.id;

                return (
                  <div
                    key={a.id}
                    className="group rounded-xl border border-zinc-800 bg-zinc-800/40 transition-all duration-200 p-4"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = `${theme.primaryHex}30`)
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgb(39,39,42)")}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getAppointmentIcon()}</span>
                        {getAppointmentTitle(a)}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete({ id: a.id, customerName: a.customer.name });
                          }}
                          className="cursor-pointer text-lg"
                        >
                          🗑️
                        </span>
                      </div>
                      <span
                        className="text-sm font-mono font-semibold rounded-lg px-2.5 py-1"
                        style={{
                          color: theme.primaryHex,
                          background: `${theme.primaryHex}10`,
                          border: `1px solid ${theme.primaryHex}20`,
                        }}
                      >
                        {new Date(a.date).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="border-t border-zinc-700/50 mb-3" />

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-zinc-600 text-xs uppercase tracking-wider mb-0.5">
                          {getCustomerLabel()}
                        </p>
                        <p className="text-lg text-zinc-300">{a.customer.name}</p>
                      </div>

                      <div>
                        <p className="text-zinc-600 text-xs uppercase tracking-wider mb-0.5">
                          Serviço
                        </p>
                        <p className="text-lg text-zinc-300">{a.notes || "—"}</p>

                        {isEditing ? (
                          <div className="flex flex-col gap-1.5 mt-2">
                            {(Object.keys(statusConfig) as AppointmentStatus[]).map((key) => {
                              const opt = statusConfig[key];
                              return (
                                <button
                                  key={key}
                                  disabled={isLoading}
                                  onClick={() => handleStatusChange(a.id, key)}
                                  className={`cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-all duration-150 ${
                                    a.status === key
                                      ? `${opt.bg} ${opt.border} ${opt.color} opacity-50 cursor-default`
                                      : `border-zinc-700 text-zinc-400 hover:${opt.bg} hover:${opt.border} hover:${opt.color}`
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />
                                  {isLoading ? "..." : opt.label}
                                </button>
                              );
                            })}
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs text-zinc-600 hover:text-zinc-400 mt-1 text-left transition-colors"
                            >
                              cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingId(a.id)}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border mt-2 ${status.bg} ${status.border} ${status.color} hover:brightness-125 transition-all duration-150 cursor-pointer`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-8 pt-4 border-t border-zinc-800 mt-4">
            <Button onClick={onNewAppointment} primaryHex={theme.primaryHex}>
              + Novo Agendamento
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (!confirmDelete) return;
          await handlerDelete(confirmDelete.id, confirmDelete.customerName);
          setConfirmDelete(null);
        }}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir o agendamento de ${confirmDelete?.customerName}? Essa ação não pode ser desfeita.`}
      />
    </>
  );
}
