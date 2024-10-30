const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://torneo-copa.vercel.app';
// Handler para el endpoint /api/equipos
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { resultadoL, resultadoV, teamL, teamV, partidoId, isDone } = req.body;
        
    if (!resultadoL || !resultadoV || !partidoId) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const { resultado90: resultado90L, resultado120: resultado120L, resultadoP: resultadoPL } = resultadoL;
    const { resultado90: resultado90V, resultado120: resultado120V, resultadoP: resultadoPV } = resultadoV;

    // Calcular el equipo ganador
    const totalL = resultado90L + resultado120L + (resultadoPL || 0);
    const totalV = resultado90V + resultado120V + (resultadoPV || 0);
    let ganador = null;

    if (totalL > totalV) {
        ganador = teamL;
    } else if (totalV > totalL) {
        ganador = teamV;
    }

    try {
        // Consultar el torneo actual para obtener los partidos
        const response = await fetch(`${REACT_APP_API_URL}/api/torneoActual`);
        const torneoActual = await response.json();
    
        // Buscar en semifinales un partido con `teamL` o `teamV` en null
        let partidoParaActualizar = null;
        const { semifinales, finales } = torneoActual;
    
        const semifinalesPartidos = [semifinales.partido1, semifinales.partido2];
        for (const partido of semifinalesPartidos) {
            if (partido.teamL.id === null) {
                partidoParaActualizar = { id: partido.id, lado: 'teamL' };
                break;
            } else if (partido.teamV.id === null) {
                partidoParaActualizar = { id: partido.id, lado: 'teamV' };
                break;
            }
        }
    
        // Si no se encontró en semifinales, buscar en la final
        if (!partidoParaActualizar) {
            if (finales.partido.teamL.id === null) {
                partidoParaActualizar = { id: finales.partido.id, lado: 'teamL' };
            } else if (finales.partido.teamV.id === null) {
                partidoParaActualizar = { id: finales.partido.id, lado: 'teamV' };
            }
        }
    
        // Si se encontró un partido para actualizar, actualizarlo
        if (partidoParaActualizar) {
            const updateQuery = `
                UPDATE partido
                SET ${partidoParaActualizar.lado} = ?
                WHERE id = ?;
            `;
            const updateValues = [ganador, partidoParaActualizar.id];
    
            const updateResult = await client.execute({
                sql: updateQuery,
                args: updateValues
            });
    
            if (updateResult.rowsAffected === 0) {
                return res.status(500).json({ error: 'Error al actualizar el partido de semifinal/final' });
            }
            console.log(`Partido de ${partidoParaActualizar.lado} actualizado correctamente.`);
        }
    
        // Continuar con la actualización del partido original
        const query = `
            UPDATE partido
            SET
                ${isDone ? 'isDone = 1,' : ''}
                resultado90L = ?, resultado120L = ?, resultadoPL = ?,
                resultado90V = ?, resultado120V = ?, resultadoPV = ?
            WHERE id = ?;
        `;
        const values = [resultado90L, resultado120L, resultadoPL, resultado90V, resultado120V, resultadoPV, partidoId];
    
        const result = await client.execute({
            sql: query,
            args: values
        });
    
        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Partido no encontrado o equipos incorrectos' });
        }
    
        res.json({ message: 'Partido actualizado correctamente', partidoId });
    
    } catch (err) {
        console.error("Error al ejecutar la consulta:", err);
        res.status(500).json({ error: "Error al setear partido" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
