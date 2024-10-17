// src/components/HistorialEquipos.js
import React, { useState, useEffect } from 'react';

const HistorialEquipos = () => {
  const [equipos, setEquipos] = useState([]);

  const fetchEquipos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/historialEquipos');
      const data = await response.json();
      setEquipos(data.data);
    } catch (error) {
      console.error('Error al obtener el historial de equipos:', error);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Equipos</h1>
      <ul>
        {equipos.map((equipo) => (
          <li key={equipo.id} className="border-b py-2">
            {equipo.nombre} - {equipo.ciudad}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistorialEquipos;
