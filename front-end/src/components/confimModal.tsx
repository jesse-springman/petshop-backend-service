'use client';

import { Fragment } from 'react/jsx-runtime';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Corfimar excluisão',
  message = 'Tem certeza que deseja excluir esse cliente, essa ação não pode ser desfeita',
}: ConfirmModalProps) {
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
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#1A1D22] p-6 text-left align-middle shadow-2xl ring-1 ring-amber-500/30 transition-all">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-amber-500/20">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-amber-500"
                    aria-hidden="true"
                  />
                </div>

                <Dialog.Title
                  as="h3"
                  className="mt-4 text-lg font-medium leading-6 text-amber-400 text-center"
                >
                  {title}
                </Dialog.Title>

                <div className="mt-3">
                  <p className="text-sm text-gray-300 text-center">{message}</p>
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-transparent bg-gray-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 cursor-pointer"
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    Excluir
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
