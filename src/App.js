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
      <nav className="w-44 bg-gray-800 text-white min-h-screen">
        <ul>
          <li
            className={`flex p-4 justify-center gap-2 cursor-pointer ${selected === 'torneo' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setSelected('torneo')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path fill-rule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 0 0-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 0 0-.552.698 5 5 0 0 0 4.503 5.152 6 6 0 0 0 2.946 1.822A6.451 6.451 0 0 1 7.768 13H7.5A1.5 1.5 0 0 0 6 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 0 0-1.5-1.5h-.268a6.453 6.453 0 0 1-.684-2.202 6 6 0 0 0 2.946-1.822 5 5 0 0 0 4.503-5.152.75.75 0 0 0-.552-.698A31.804 31.804 0 0 0 16 2.562v-.387a.75.75 0 0 0-.629-.74A33.227 33.227 0 0 0 10 1ZM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 0 1-1.855-2.68Zm14.95 0a3.503 3.503 0 0 1-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.099.988.21 1.475.332Z" clip-rule="evenodd" />
            </svg>
            Torneo
          </li>
          <li
            className={`flex p-4 justify-center gap-2 cursor-pointer ${selected === 'historialTorneos' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setSelected('historialTorneos')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path fill-rule="evenodd" d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5V7A2.5 2.5 0 0 0 11 4.5H8.128a2.252 2.252 0 0 1 1.884-1.488A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z" clip-rule="evenodd" />
              <path fill-rule="evenodd" d="M2 7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Zm2 3.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
            </svg>
            Historial Torneos
          </li>
          <li
            className={`flex p-4 justify-center gap-2 cursor-pointer ${selected === 'historialEquipos' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => setSelected('historialEquipos')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z"/></svg>
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
