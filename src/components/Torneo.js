/* eslint-disable default-case */
// src/components/Torneo.js
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CheckIcon } from '@heroicons/react/outline';

const Torneo = () => {
  const [isModalOpenElegir, setModalOpenElegir] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [equipos, setEquipos] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [torneoActual, setTorneoActual] = useState(null);
  const [tournamentGenerated, setTournamentGenerated] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    const fecthData = async () => {
      await fetchEquipos();
      await fetchTorneoActual();
    }
    fecthData()
  }, []);

  const openModalElegir = () => {
    setModalOpenElegir(true);
    setIsEdit(false);
  };

  const fetchEquipos = async () => {
    try {
      const response = await fetch('http://localhost:5000/equipos');
      const data = await response.json();
      setEquipos(data);
    } catch (error) {
      console.error("Error al obtener equipos:", error);
    }
  };

  const fetchTorneoActual = async () => {
    try {
      const response = await fetch('http://localhost:5000/torneoActual');
      const data = await response.json();
      console.log(data);
      setTorneoActual(data);
    } catch (error) {
      console.error("Error al obtener el torneo actual:", error);
    }
  };

  const toggleSelectTeam = (equipo) => {
    if (selectedTeams.some(t => t.id === equipo.id)) {
      // Deseleccionar
      setSelectedTeams(selectedTeams.filter(t => t.id !== equipo.id));
    } else if (selectedTeams.length < 8) {
      // Seleccionar
      setSelectedTeams([...selectedTeams, equipo]);
    }
  };
  
  const filteredEquipos = equipos.filter(equipo =>
    equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateTournament = async () => {
    const teamIds = selectedTeams.map(team => team.id);
    try {
      const response = await fetch('http://localhost:5000/generarTorneo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamIds }),
      });

      if (response.ok) {
        console.log("Torneo generado con éxito.");
        setTournamentGenerated(true);
        setSelectedTeams([]); // Limpiar selección después de generar el torneo
        setConfirmado(false);
      } else {
        console.error("Error al generar el torneo.");
      }
    } catch (error) {
      console.error("Error al llamar al endpoint:", error);
    }
  };

  const handleConfirmSelection = () => {
    setConfirmado(true); // Marcar como confirmado
    setModalOpenElegir(false); // Cerrar modal
  };

  const handleCloseModalElegir = () => {
    if (isEdit) {
      return; // No cerrar el modal si estás en modo de edición y no hay 8 equipos
    }
    setModalOpenElegir(false);
    setSearchTerm(''); // Limpiar el buscador al cerrar el modal
    if (!isEdit) {
      setSelectedTeams([]); // Limpiar selección al cerrar el modal
      setConfirmado(false); // Limpiar estado de confirmación
    }
  };

  // Nueva función para editar selección
  const editSeleccion = () => {
    openModalElegir(); // Abrir el modal
    setIsEdit(true);
    setConfirmado(false);
  };

  // Función para renderizar los partidos
  const renderPartidos = (partidos, titulo) => {
    console.log("Renderizando partidos para:", titulo);
    console.log("Partidos recibidos:", partidos);
  
    // Convertir el objeto de partidos en un array
    let partidosArray = []
    switch(titulo){
      case 'Cuartos de Final':
        partidosArray = [partidos.partido1, partidos.partido2, partidos.partido3, partidos.partido4]
      break;
      case 'semifinales':
        partidosArray = [partidos.partido1, partidos.partido2]
      break;
      case 'finales':
        partidosArray = [partidos.partido1]
      break;
    }
    console.log("Partidos array:", partidosArray);
  
    // Verificar que partidosArray es un array
    if (!Array.isArray(partidosArray)) {
      console.error("Error: partidosArray no es un array.", partidosArray);
      return <p>No hay partidos disponibles.</p>;
    }
  
    return (
      <div className=''>
        <h3 className="text-xl font-bold mt-4 text-center">{titulo}</h3>
        <table className="min-w-full border-collapse border bg-slate-900">
          <tbody>
            {partidosArray ? 
            <>
              {
                partidosArray.map((partido) => (
                  <tr key={partido.id}>
                    <td className="border p-2">
                      <img src={partido.teamL.logo} alt={partido.teamL.nombre} className="h-16 mx-auto" />
                    </td>
                    <td className="border p-2 text-center text-4xl w-20">{partido.teamL.resultado90 !== null ? partido.teamL.resultado90 : '-'}</td>
                    <td className="border p-2 text-center text-4xl w-20">-</td>
                    <td className="border p-2 text-center text-4xl w-20">{partido.teamV.resultado90 !== null ? partido.teamV.resultado90 : '-'}</td>
                    <td className="border p-2">
                      <img src={partido.teamV.logo} alt={partido.teamV.nombre} className="h-16 mx-auto" />
                    </td>
                  </tr>
                ))
              }
            </>
            : 
            <div>
              a
            </div>
            }
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className='flex justify-center flex-col items-center'>
      <h1 className="text-2xl font-bold mb-4">Gestión de Torneos</h1>

      {/* Modal para elegir equipos */}
      <Modal isOpen={isModalOpenElegir} onClose={handleCloseModalElegir}>
        <div className=''>
          <h2 className="text-xl font-bold mb-4">
            Seleccionar Equipos: {selectedTeams.length}/8
          </h2>
          
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="border border-gray-300 p-2 mb-4 w-full bg-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="grid grid-cols-4 gap-4">
            {/* Renderizar los equipos con sus logos */}
            {filteredEquipos.length > 0 ? (
              filteredEquipos.map((equipo) => (
                <div
                  key={equipo.id}
                  className="relative flex justify-center cursor-pointer"
                  onClick={() => toggleSelectTeam(equipo)}
                  title={equipo.nombre} // Tooltip con el nombre del equipo
                >
                  <img
                    src={equipo.logo}
                    alt="Logo equipo"
                    className={`h-20 object-contain ${selectedTeams.some(t => t.id === equipo.id) ? 'opacity-50' : ''}`}
                  />
                  {selectedTeams.some(t => t.id === equipo.id) && (
                    <CheckIcon className="absolute top-0 right-0 w-6 h-6 text-green-500" />
                  )}
                </div>
              ))
            ) : (
              <p>No se encontraron equipos.</p>
            )}
          </div>

          <button
            className={`mt-4 text-white rounded-md float-right ${selectedTeams.length !== 8 ? 'bg-gray-400' : 'bg-green-500'}`}
            onClick={handleConfirmSelection}
            disabled={selectedTeams.length !== 8} // Desactivar si no hay 8 seleccionados
          >
            Confirmar selección
          </button>
        </div>
      </Modal>

      {!tournamentGenerated && !confirmado && !isModalOpenElegir && !torneoActual &&(
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={openModalElegir}
        >
          Elegir equipos
        </button>
      )}

      {confirmado && !torneoActual && selectedTeams.length > 0 && !tournamentGenerated && (
        <div className="mt-4 flex justify-center items-center flex-col">
          <h2 className="text-lg font-bold mb-2">Equipos seleccionados:</h2>
          <div className="w-full">
            <div className="selected-teams-container">
              {selectedTeams.map(team => (
                <div key={team.id} className="relative" title={team.nombre}>
                  <img
                    src={team.logo}
                    alt={team.nombre}
                    className="h-16 object-contain mx-1"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <button 
              className="btn-success"
              onClick={generateTournament}
            >
              Generar Torneo
            </button>
            <button 
              className="btn-secondary"
              onClick={editSeleccion} // Usar la nueva función
            >
              Editar selección
            </button>
          </div>
        </div>
      )}

      {/* Mostrar partidos del torneo actual */}
      {torneoActual && (
        <div className='flex gap-4'>
          <div>
            {torneoActual.cuartos && renderPartidos(torneoActual.cuartos, 'Cuartos de Final')}
          </div>
          <div>
            {torneoActual.semifinales && renderPartidos(torneoActual.semifinales, 'Semifinales')}
            {torneoActual.finales && renderPartidos(torneoActual.finales, 'Final')}
          </div>
        </div>
      )}
    </div>
  );
};

export default Torneo;
