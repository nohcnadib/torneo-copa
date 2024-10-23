/* eslint-disable default-case */
// src/components/Torneo.js
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CheckIcon } from '@heroicons/react/outline';
import { Football } from '@heroicons/react/outline';

const Torneo = () => {
  const [isModalOpenElegir, setModalOpenElegir] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [equipos, setEquipos] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [torneoActual, setTorneoActual] = useState(null);
  const [tournamentGenerated, setTournamentGenerated] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

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
      console.log("data");
      console.log(data);
      if(data.error === 'No se encontró un torneo actual.'){
        console.log("seteando a nulls");
        setTorneoActual(null);
      }else{
        console.log("data");
        setTorneoActual(data);
      }
      setTournamentGenerated(false);
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
        await fetchTorneoActual()
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
  
  // Modal para los marcadores de 90, 120 y penales
  const ModalResultadoPartido = ({ partido, onClose }) => {
    const [resultado90L, setResultado90L] = useState(partido?.teamL?.resultado90 || 0);
    const [resultado120L, setResultado120L] = useState(partido?.teamL?.resultado120 || 0);
    const [resultadoPL, setResultadoPL] = useState(partido?.teamL?.resultadoP || 0);
    
    const [resultado90V, setResultado90V] = useState(partido?.teamV?.resultado90 || 0);
    const [resultado120V, setResultado120V] = useState(partido?.teamV?.resultado120 || 0);
    const [resultadoPV, setResultadoPV] = useState(partido?.teamV?.resultadoP || 0);

    const handleConfirmarResultado = async () => {
      try {
        const response = await fetch('http://localhost:5000/setPartido', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resultadoL: {
              resultado90: resultado90L,
              resultado120: resultado120L,
              resultadoP: resultadoPL,
            },
            resultadoV: {
              resultado90: resultado90V,
              resultado120: resultado120V,
              resultadoP: resultadoPV,
            },
            teamL: partido.teamL.id,
            teamV: partido.teamV.id,
            partidoId: partido.id,
            isDone: 1,
          }),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Resultado confirmado:', data);
          // Aquí puedes agregar una lógica para manejar el éxito de la operación, 
          // como cerrar el modal o actualizar el estado de los partidos.
          onClose(); // Por ejemplo, cerrar el modal después de confirmar.
        } else {
          console.error('Error al confirmar el resultado:', response.statusText);
        }
        
        await fetchTorneoActual();
      } catch (error) {
        console.error('Error de red o en el servidor:', error);
      }
    };

    return (
      <Modal onClose={onClose} isOpen={true}>
        <div>
          <div className="flex justify-center items-center mb-4 gap-8">
            <div className='w-full justify-center flex'>
              <img src={partido?.teamL?.logo ?? './assets/images/fakeLogo.png'} alt={partido?.teamL?.nombre} className="h-36" />
            </div>
            <table className="text-center text-3xl tabla-resultados">
              <tbody className='text-center flex flex-col gap-2'>
                {/* Marcador 90' */}
                <div>
                  <span className='text-lg'>90'</span>
                  <tr>
                    <td><input type="number" value={resultado90L} onChange={(e) => setResultado90L(Number(e.target.value))} className="w-24 h-16 text-center" /></td>
                    <td><div className='px-4' style={{marginRight: '-4px'}}>-</div></td>
                    <td><input type="number" value={resultado90V} onChange={(e) => setResultado90V(Number(e.target.value))} className="w-24 h-16 text-center" /></td>
                  </tr>
                </div>
                {/* Marcador 120' */}
                <div>
                  <span className='text-lg'>120'</span>
                  <tr>
                    <td><input type="number" value={resultado120L} onChange={(e) => setResultado120L(Number(e.target.value))} className="w-24 h-16 text-center" /></td>
                    <td><div className='px-4' style={{marginRight: '-4px'}}>-</div></td>
                    <td><input type="number" value={resultado120V} onChange={(e) => setResultado120V(Number(e.target.value))} className="w-24 h-16 text-center" /></td>
                  </tr>
                </div>
                {/* Marcador Penales */}
                <div>
                  <span className='text-lg'>penales</span>
                  <tr>
                    <td><input type="number" value={resultadoPL} onChange={(e) => setResultadoPL(Number(e.target.value))} className="w-24 h-16 text-center" /></td>
                    <td><div className='px-4' style={{marginRight: '-4px'}}>-</div></td>
                    <td><input type="number" value={resultadoPV} onChange={(e) => setResultadoPV(Number(e.target.value))} className="w-24 h-16 text-center" /></td>
                  </tr>
                </div>
              </tbody>
            </table>
            <div className='w-full justify-center flex'>
              <img src={partido?.teamV?.logo ?? './assets/images/fakeLogo.png'} alt={partido?.teamV?.nombre} className="h-36" />
            </div>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={handleConfirmarResultado} 
              className="btn-success"
              disabled={
                // Deshabilitar si las sumas son iguales
                (resultado90L + resultado120L + resultadoPL) === (resultado90V + resultado120V + resultadoPV)
              }
            >
              Confirmar Resultado
            </button>
          </div>
        </div>
      </Modal>
    );
    
  };

  // Modificación en el renderPartidos para abrir el modal
  const renderPartidos = (partidos, titulo) => {

    const handleJugar = (partido) => {
      console.log(partido)
      setPartidoSeleccionado(partido)
    };

    const cerrarModal = () => {
      setPartidoSeleccionado(null)
    };

    let partidosArray = [];
    switch (titulo) {
      case 'Cuartos de Final':
        partidosArray = [partidos.partido1, partidos.partido2, partidos.partido3, partidos.partido4];
        break;
      case 'Semifinales':
        partidosArray = [partidos.partido1, partidos.partido2];
        break;
      case 'Final':
        partidosArray = [partidos.partido];
        break;
      default:
        break;
    }

    if (!Array.isArray(partidosArray)) {
      console.error("Error: partidosArray no es un array.", partidosArray);
      return <p>No hay partidos disponibles.</p>;
    }

    return (
      <div className='bg-slate-400 p-2 rounded-md'>
        <h3 className="text-xl font-bold text-center mb-2 text-black">{titulo}</h3>
        <table className="min-w-full border-collapse border bg-slate-900">
          <tbody>
            {
              partidosArray.map((partido) => {
                const resultadoTeamL = (partido.teamL.resultado90 ?? 0) + (partido.teamL.resultado120 ?? 0);
                const resultadoTeamV = (partido.teamV.resultado90 ?? 0) + (partido.teamV.resultado120 ?? 0);

                let colorTeamL = 'text-white';
                let colorTeamV = 'text-white';

                if (partido.isDone) {
                  if (resultadoTeamL > resultadoTeamV) {
                    colorTeamL = 'text-green-500';
                    colorTeamV = 'text-red-500';
                  } else if (resultadoTeamL < resultadoTeamV) {
                    colorTeamL = 'text-red-500';
                    colorTeamV = 'text-green-500';
                  } else {
                    colorTeamL = colorTeamV = 'text-yellow-500';
                  }
                }

                return (
                  <tr key={partido.id} className='tabla-resultados'>
                    <td className="border p-2">
                      <img src={partido?.teamL?.logo ?? './assets/images/fakeLogo.png'} alt={partido.teamL?.nombre} className="h-16 mx-auto" />
                    </td>
                    <td className={`border p-2 text-center text-4xl w-30 ${colorTeamL}`}>
                      {partido.isDone ? resultadoTeamL : (partido.teamL.resultado90 !== null ? resultadoTeamL : '-')}
                      {resultadoTeamL === resultadoTeamV && partido.isDone && partido.teamL.resultadoP !== null ? (
                        <sup>{partido.teamL.resultadoP}</sup>
                      ) : null}
                    </td>
                    <td className="border p-2 text-center text-4xl w-20">
                      {partido.isDone ? '-' : (
                        (partido.teamL.id && partido.teamV.id) ? (
                          <button onClick={() => handleJugar(partido)} className="btn-success text-white font-bold py-4 px-4 rounded text-lg">
                            JUGAR
                          </button>
                        ) : '-'
                      )}
                    </td>
                    <td className={`border p-2 text-center text-4xl w-30 ${colorTeamV}`}>
                      {partido.isDone ? resultadoTeamV : (partido.teamV.resultado90 !== null ? resultadoTeamV : '-')}
                      {resultadoTeamL === resultadoTeamV && partido.isDone && partido.teamV.resultadoP !== null ? (
                        <sup>{partido.teamV.resultadoP}</sup>
                      ) : null}
                    </td>
                    <td className="border p-2">
                      <img src={partido?.teamV?.logo ?? './assets/images/fakeLogo.png'} alt={partido.teamV?.nombre} className="h-16 mx-auto" />
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        {/* Modal para jugar el partido */}
        {partidoSeleccionado && 
          <ModalResultadoPartido partido={partidoSeleccionado} onClose={cerrarModal} />
        }
      </div>
    );
  };

  const finalizarTorneo = async () => {
    // Obtener los resultados de la final
    const resultadoL = torneoActual?.finales?.partido?.teamL; // Resultados del equipo L
    const resultadoV = torneoActual?.finales?.partido?.teamV; // Resultados del equipo V
  
    // Calcular la suma de los resultados
    const sumaResultadoL = (resultadoL?.resultado90 || 0) + (resultadoL?.resultado120 || 0) + (resultadoL?.resultadoP || 0);
    const sumaResultadoV = (resultadoV?.resultado90 || 0) + (resultadoV?.resultado120 || 0) + (resultadoV?.resultadoP || 0);
  
    // Determinar el ID del equipo ganador
    let equipoGanadorId;
    if (sumaResultadoL > sumaResultadoV) {
      equipoGanadorId = torneoActual.finales.partido.teamL?.id; // Ajusta según tu estructura
    } else if (sumaResultadoV > sumaResultadoL) {
      equipoGanadorId = torneoActual.finales.partido.teamV?.id; // Ajusta según tu estructura
    }
  
    try {
      const response = await fetch('http://localhost:5000/finalizarTorneo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          torneoId: torneoActual.id,
          equipoId: equipoGanadorId,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al finalizar el torneo');
      }
  
      const data = await response.json();
      console.log('Torneo finalizado:', data);
      await fetchTorneoActual()
      // Aquí puedes hacer lo que necesites tras finalizar el torneo, como actualizar el estado o mostrar un mensaje.
    } catch (error) {
      console.error('Error:', error);
    }
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
          <div className='flex flex-col justify-between'>
            {torneoActual.semifinales && renderPartidos(torneoActual.semifinales, 'Semifinales')}
            {torneoActual.finales && renderPartidos(torneoActual.finales, 'Final')}
          </div>
        </div>
      )}

      {torneoActual?.finales?.partido?.isDone === 1 && 
        <div className="flex justify-center mt-4">
          <button 
            className='btn-success gap-2 items-center justify-center'
            onClick={finalizarTorneo} // Llama a la función finalizarTorneo
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
              <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm200-500 54-18 16-54q-32-48-77-82.5T574-786l-54 38v56l160 112Zm-400 0 160-112v-56l-54-38q-54 17-99 51.5T210-652l16 54 54 18Zm-42 308 46-4 30-54-58-174-56-20-40 30q0 65 18 118.5T238-272Zm242 112q26 0 51-4t49-12l28-60-26-44H378l-26 44 28 60q24 8 49 12t51 4Zm-90-200h180l56-160-146-102-144 102 54 160Zm332 88q42-50 60-103.5T800-494l-40-28-56 18-58 174 30 54 46 4Z"/>
            </svg>
            Siguiente Torneo
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path fillRule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 0 0-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 0 0-.552.698 5 5 0 0 0 4.503 5.152 6 6 0 0 0 2.946 1.822A6.451 6.451 0 0 1 7.768 13H7.5A1.5 1.5 0 0 0 6 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 0 0-1.5-1.5h-.268a6.453 6.453 0 0 1-.684-2.202 6 6 0 0 0 2.946-1.822 5 5 0 0 0 4.503-5.152.75.75 0 0 0-.552-.698A31.804 31.804 0 0 0 16 2.562v-.387a.75.75 0 0 0-.629-.74A33.227 33.227 0 0 0 10 1ZM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 0 1-1.855-2.68Zm14.95 0a3.503 3.503 0 0 1-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.099.988.21 1.475.332Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      }
    </div>
  );
};

export default Torneo;
