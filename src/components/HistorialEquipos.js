import React, { useState, useEffect } from 'react';
import Loading from './Loading';

const HistorialEquipos = () => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://torneo-copa.vercel.app';
  const [equipos, setEquipos] = useState([]);
  const [orden, setOrden] = useState('titulos'); // Estado para manejar el criterio de orden
  const [isLoading, setIsLoading] = useState(false);

  
  const fetchEquipos = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_URL}/api/equipos`);
      const data = await response.json();
      setEquipos([...data].sort((a, b) => b['titulos'] - a['titulos']));
    } catch (error) {
      console.error('Error al obtener el historial de equipos:', error);
    }
  };

  useEffect(() => {
    const fecthData = async () => {
      setIsLoading(true)
      await fetchEquipos();
      setIsLoading(false)
    }
    fecthData()
  }, []);
  // Función para ordenar los equipos según el criterio seleccionado
  const ordenarEquipos = (criterio) => {
    const equiposOrdenados = [...equipos].sort((a, b) => b[criterio] - a[criterio]);
    setEquipos(equiposOrdenados);
    setOrden(criterio); // Actualizar el estado de orden
  };

  // Dividir los equipos en tres partes
  const dividirEquiposEnColumnas = () => {
    const tercio = Math.ceil(equipos.length / 3);
    const primerTercio = equipos.slice(0, tercio);
    const segundoTercio = equipos.slice(tercio, tercio * 2);
    const tercerTercio = equipos.slice(tercio * 2);
    return { primerTercio, segundoTercio, tercerTercio };
  };

  const { primerTercio, segundoTercio, tercerTercio } = dividirEquiposEnColumnas();

  return (
    <>
      {isLoading && 
        <Loading></Loading>
      }
      <div className="px-4">
        {/* Menú superior para seleccionar el criterio de orden */}
        <div className="flex justify-around mb-4 bg-slate-700">
          <button 
            className={`btn ${orden === 'titulos' ? 'btn-active' : ''}`} 
            onClick={() => ordenarEquipos('titulos')}>
            Títulos
          </button>
          <button 
            className={`btn ${orden === 'partidos_ganados' ? 'btn-active' : ''}`} 
            onClick={() => ordenarEquipos('partidos_ganados')}>
            Partidos Ganados
          </button>
          <button 
            className={`btn ${orden === 'goles_favor' ? 'btn-active' : ''}`} 
            onClick={() => ordenarEquipos('goles_favor')}>
            Goles a Favor
          </button>
        </div>


        {/* Contenedor para las tres columnas */}
        {orden !== "" && 
        
        <div className="w-full text-3xl justify-center flex mt-12">
          <div className='w-1/2 flex gap-4 '>
            {/* Columna Izquierda */}
            <div className="w-1/3">
              {primerTercio.map((equipo, index) => (
                <div key={equipo.id} className="flex items-center p-2 border-b gap-6 justify-center border-slate-500">
                  <span className="font-bold text-slate-300 text-2xl">{index + 1}.</span>
                  <div className='w-20 flex justify-center'>
                    <img src={equipo.logo} alt={`${equipo.nombre} logo`} className="h-20 mr-4" />
                  </div>
                  <div className='text-black text-5xl'>
                    {orden === 'titulos' && <span>{equipo.titulos}</span>}
                    {orden === 'partidos_ganados' && <span>{equipo.partidos_ganados}</span>}
                    {orden === 'goles_favor' && <span>{equipo.goles_favor}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Columna Central */}
            <div className="w-1/3">
              {segundoTercio.map((equipo, index) => (
                <div key={equipo.id} className="flex items-center p-2 border-b gap-6 justify-center border-slate-500">
                  <span className="font-bold text-slate-300 text-2xl">{primerTercio.length + index + 1}.</span>
                  <div className='w-20 flex justify-center'>
                    <img src={equipo.logo} alt={`${equipo.nombre} logo`} className="h-20 mr-4" />
                  </div>
                  <div className='text-black text-5xl'>
                    {orden === 'titulos' && <span>{equipo.titulos}</span>}
                    {orden === 'partidos_ganados' && <span>{equipo.partidos_ganados}</span>}
                    {orden === 'goles_favor' && <span>{equipo.goles_favor}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Columna Derecha */}
            <div className="w-1/3">
              {tercerTercio.map((equipo, index) => (
                <div key={equipo.id} className="flex items-center p-2 border-b gap-6 justify-center border-slate-500">
                  <span className="font-bold text-slate-300 text-2xl">{primerTercio.length + segundoTercio.length + index + 1}.</span>
                  <div className='w-20 flex justify-center'>
                    <img src={equipo.logo} alt={`${equipo.nombre} logo`} className="h-20 mr-4" />
                  </div>
                  <div className='text-black text-5xl'>
                    {orden === 'titulos' && <span>{equipo.titulos}</span>}
                    {orden === 'partidos_ganados' && <span>{equipo.partidos_ganados}</span>}
                    {orden === 'goles_favor' && <span>{equipo.goles_favor}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        }
      </div>
    </>
  );
};

export default HistorialEquipos;
