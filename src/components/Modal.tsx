import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-black/60 p-4 sm:p-6 rounded-2xl backdrop-blur-lg ring-1 ring-yellow-500/20 w-full sm:max-w-md mx-auto">
        <h3 className="text-lg font-medium text-yellow-400 mb-4">Informasi</h3>
        <p className="text-sm text-gray-300">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;