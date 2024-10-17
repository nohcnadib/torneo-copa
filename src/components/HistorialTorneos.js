// src/components/HistorialTorneos.js
import React, { useState, useEffect } from 'react';

const HistorialTorneos = () => {
  const [historial, setHistorial] = useState([]);

  const fetchHistorial = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/historialTorneos');
      const data = await response.json();
      setHistorial(data.data);
    } catch (error) {
      console.error('Error al obtener el historial de torneos:', error);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Torneos</h1>
      <ul>
        {historial.map((torneo) => (
          <li key={torneo.id} className="border-b py-2">
            {torneo.nombre} - {torneo.fecha}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistorialTorneos;
