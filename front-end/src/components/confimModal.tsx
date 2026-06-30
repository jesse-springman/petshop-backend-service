"use client";
import { Fragment } from "react/jsx-runtime";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ConfirmModalProps } from "@/types/confirmModalProps";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  theme,
  confirmLabel = "Confirmar",
  confirmDanger = false,
}: ConfirmModalProps) {
  const accentColor = theme?.primaryHex ?? "#f59e0b";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#1A1D22] p-6 text-left align-middle shadow-2xl transition-all font-sans"
                style={{ border: `1px solid ${accentColor}30` }}
              >
                {/* Ícone */}
                <div
                  className="flex items-center justify-center w-12 h-12 mx-auto rounded-full"
                  style={{ background: `${accentColor}20` }}
                >
                  <ExclamationTriangleIcon
                    className="h-6 w-6"
                    style={{ color: accentColor }}
                    aria-hidden="true"
                  />
                </div>

                {/* Título */}
                <Dialog.Title
                  as="h3"
                  className="mt-4 text-lg font-semibold leading-6 text-center"
                  style={{ color: accentColor }}
                >
                  {title}
                </Dialog.Title>

                {/* Mensagem */}
                <p className="mt-3 text-sm text-zinc-400 text-center leading-relaxed">
                  {message}
                </p>

                {/* Botões */}
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer px-5 py-2.5 rounded-lg text-sm font-medium border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => { onConfirm(); onClose(); }}
                    className="cursor-pointer px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
                    style={
                      confirmDanger
                        ? { background: "#ef4444", color: "#fff" }
                        : { background: accentColor, color: "#000" }
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.85";
                      e.currentTarget.style.boxShadow = `0 4px 16px ${confirmDanger ? "#ef444440" : accentColor + "40"}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {confirmLabel}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
