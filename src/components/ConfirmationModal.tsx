import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

export function ConfirmationModal({ isOpen, onConfirm, onCancel, message }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 max-w-md w-full mx-4 space-y-4 ring-1 ring-yellow-500/20">
        <p className="text-sm text-white">{message}</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onCancel}
            className="text-xs px-2 py-1 bg-zinc-500/10 text-zinc-400 rounded-lg hover:bg-zinc-500/20 cursor-pointer"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}