// src/App.js
import React, { useState } from 'react';
import Torneo from './components/Torneo';
import HistorialTorneos from './components/HistorialTorneos';
import HistorialEquipos from './components/HistorialEquipos';

function App() {
  const [selected, setSelected] = useState('torneo');

  const renderContent = () => {
    switch (selected) {
      case 'torneo':
        return <Torneo />;
      case 'historialTorneos':
        return <HistorialTorneos />;
      case 'historialEquipos':
        return <HistorialEquipos />;
      default:
        return <Torneo />;
    }
  };

  return (
    <div className="flex ">
      {/* Menú Lateral */}
      <nav className="w-40 bg-gray-800 text-white min-h-screen">
        <ul>
          <li
            className={`p-4 cursor-pointer ${selected === 'torneo' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setSelected('torneo')}
          >
            Torneo
          </li>
          <li
            className={`p-4 cursor-pointer ${selected === 'historialTorneos' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setSelected('historialTorneos')}
          >
            Historial Torneos
          </li>
          <li
            className={`p-4 cursor-pointer ${selected === 'historialEquipos' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setSelected('historialEquipos')}
          >
            Historial Equipos
          </li>
        </ul>
      </nav>

      {/* Área de Contenido */}
      <main className="flex-1 p-4 bg-slate-600">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
