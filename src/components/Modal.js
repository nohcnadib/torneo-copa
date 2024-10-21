// src/components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada.

  return (
    <div className="ml-40 fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg shadow-lg w-1/2 p-6 relative bg-slate-900">
        {/* Botón de cierre */}
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>X</button>
        {/* Cuerpo del modal */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
