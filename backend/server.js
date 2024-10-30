const express = require('express');
const cors = require('cors');
const path = require('path');

// Configuración de dotenv
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS y JSON
app.use(cors());
app.use(express.json());

// Importar el handler del endpoint /api/equipos
const equiposHandler = require('../api/equipos'); // Asegúrate de que la ruta sea correcta
// Definir el endpoint
app.use('/api/equipos', equiposHandler);

// Endpoint para generar el torneo
app.post('/generarTorneo', (req, res) => {
  const { teamIds } = req.body;

  if (teamIds.length !== 8) {
    return res.status(400).json({ error: 'Se deben seleccionar exactamente 8 equipos.' });
  }

  // Barajar los equipos para los cuartos de final
  const shuffledTeams = teamIds.sort(() => Math.random() - 0.5);

  db.serialize(() => {
    // Crear los 4 partidos de cuartos en la tabla `partido` con los equipos seleccionados
    db.run(`
      INSERT INTO partido (teamL, teamV) VALUES 
      (?, ?), (?, ?), (?, ?), (?, ?)
    `, [
      shuffledTeams[0], shuffledTeams[1], 
      shuffledTeams[2], shuffledTeams[3], 
      shuffledTeams[4], shuffledTeams[5], 
      shuffledTeams[6], shuffledTeams[7]
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error al generar los partidos de cuartos.' });
      }

      const cuartosIds = [this.lastID - 3, this.lastID - 2, this.lastID - 1, this.lastID]; // Obtener los IDs de los partidos creados

      // Insertar en la tabla `cuartos`
      db.run(`
        INSERT INTO cuartos (partido1, partido2, partido3, partido4) VALUES (?, ?, ?, ?)
      `, [...cuartosIds], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error al insertar en la tabla de cuartos.' });
        }

        const cuartosId = this.lastID; // ID de la entrada en cuartos

        // Crear partidos de semifinales (sin definir teams todavía)
        db.run(`
          INSERT INTO partido (teamL, teamV) VALUES (NULL, NULL), (NULL, NULL)
        `, function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error al generar los partidos de semifinales.' });
          }

          const semifinalesIds = [this.lastID - 1, this.lastID]; // Obtener los IDs de los partidos de semifinales

          // Insertar en la tabla `semifinales`
          db.run(`
            INSERT INTO semifinales (partido1, partido2) VALUES (?, ?)
          `, [...semifinalesIds], function(err) {
            if (err) {
              return res.status(500).json({ error: 'Error al insertar en la tabla de semifinales.' });
            }

            const semifinalesId = this.lastID; // ID de la entrada en semifinales

            // Crear partido de la final (sin definir teams)
            db.run(`
              INSERT INTO partido (teamL, teamV) VALUES (NULL, NULL)
            `, function(err) {
              if (err) {
                return res.status(500).json({ error: 'Error al generar el partido final.' });
              }

              const finalId = this.lastID; // ID del partido de la final

              // Insertar en la tabla `finales`
              db.run(`
                INSERT INTO finales (partido1) VALUES (?)
              `, [finalId], function(err) {
                if (err) {
                  return res.status(500).json({ error: 'Error al insertar en la tabla de finales.' });
                }

                const finalTorneoId = this.lastID;

                // Insertar en la tabla del torneo
                db.run(`
                  INSERT INTO torneo (cuartosId, semifinalesId, finalesId, isCurrent) 
                  VALUES (?, ?, ?, 1)
                `, [cuartosId, semifinalesId, finalTorneoId], (err) => {
                  if (err) {
                    return res.status(500).json({ error: 'Error al crear el torneo.' });
                  }

                  res.status(200).json({ message: 'Torneo generado exitosamente.' });
                });
              });
            });
          });
        });
      });
    });
  });
});

// Endpoint para obtener el torneo actual con todas sus fases, partidos y equipos
app.get('/torneoActual', (req, res) => {
  const query = `
  SELECT 
    t.id AS torneoId, t.isCurrent,
    
    -- Cuartos de final
    c.id AS cuartosId, 
    pC1.id AS cuartosPartido1Id, pC1.teamL AS cuartosTeamL1, pC1.teamV AS cuartosTeamV1,
    pC1.resultado90L AS cuartosTeamL1Resultado90, pC1.resultado120L AS cuartosTeamL1Resultado120, pC1.resultadoPL AS cuartosTeamL1ResultadoP,
    pC1.resultado90V AS cuartosTeamV1Resultado90, pC1.resultado120V AS cuartosTeamV1Resultado120, pC1.resultadoPV AS cuartosTeamV1ResultadoP,
    pC1.isDone AS cuartos1isDone,  -- Agregado
    
    pC2.id AS cuartosPartido2Id, pC2.teamL AS cuartosTeamL2, pC2.teamV AS cuartosTeamV2,
    pC2.resultado90L AS cuartosTeamL2Resultado90, pC2.resultado120L AS cuartosTeamL2Resultado120, pC2.resultadoPL AS cuartosTeamL2ResultadoP,
    pC2.resultado90V AS cuartosTeamV2Resultado90, pC2.resultado120V AS cuartosTeamV2Resultado120, pC2.resultadoPV AS cuartosTeamV2ResultadoP,
    pC2.isDone AS cuartos2isDone,  -- Agregado
    
    pC3.id AS cuartosPartido3Id, pC3.teamL AS cuartosTeamL3, pC3.teamV AS cuartosTeamV3,
    pC3.resultado90L AS cuartosTeamL3Resultado90, pC3.resultado120L AS cuartosTeamL3Resultado120, pC3.resultadoPL AS cuartosTeamL3ResultadoP,
    pC3.resultado90V AS cuartosTeamV3Resultado90, pC3.resultado120V AS cuartosTeamV3Resultado120, pC3.resultadoPV AS cuartosTeamV3ResultadoP,
    pC3.isDone AS cuartos3isDone,  -- Agregado
    
    pC4.id AS cuartosPartido4Id, pC4.teamL AS cuartosTeamL4, pC4.teamV AS cuartosTeamV4,
    pC4.resultado90L AS cuartosTeamL4Resultado90, pC4.resultado120L AS cuartosTeamL4Resultado120, pC4.resultadoPL AS cuartosTeamL4ResultadoP,
    pC4.resultado90V AS cuartosTeamV4Resultado90, pC4.resultado120V AS cuartosTeamV4Resultado120, pC4.resultadoPV AS cuartosTeamV4ResultadoP,
    pC4.isDone AS cuartos4isDone,  -- Agregado
    
    -- Semifinales
    s.id AS semifinalesId,
    pS1.id AS semifinalesPartido1Id, pS1.teamL AS semifinalesTeamL1, pS1.teamV AS semifinalesTeamV1,
    pS1.resultado90L AS semifinalesTeamL1Resultado90, pS1.resultado120L AS semifinalesTeamL1Resultado120, pS1.resultadoPL AS semifinalesTeamL1ResultadoP,
    pS1.resultado90V AS semifinalesTeamV1Resultado90, pS1.resultado120V AS semifinalesTeamV1Resultado120, pS1.resultadoPV AS semifinalesTeamV1ResultadoP,
    pS1.isDone AS semifinales1isDone,  -- Agregado
    
    pS2.id AS semifinalesPartido2Id, pS2.teamL AS semifinalesTeamL2, pS2.teamV AS semifinalesTeamV2,
    pS2.resultado90L AS semifinalesTeamL2Resultado90, pS2.resultado120L AS semifinalesTeamL2Resultado120, pS2.resultadoPL AS semifinalesTeamL2ResultadoP,
    pS2.resultado90V AS semifinalesTeamV2Resultado90, pS2.resultado120V AS semifinalesTeamV2Resultado120, pS2.resultadoPV AS semifinalesTeamV2ResultadoP,
    pS2.isDone AS semifinales2isDone,  -- Agregado
    
    -- Final
    f.id AS finalesId,
    pF1.id AS finalPartidoId, pF1.teamL AS finalTeamL, pF1.teamV AS finalTeamV,
    pF1.resultado90L AS finalTeamLResultado90, pF1.resultado120L AS finalTeamLResultado120, pF1.resultadoPL AS finalTeamLResultadoP,
    pF1.resultado90V AS finalTeamVResultado90, pF1.resultado120V AS finalTeamVResultado120, pF1.resultadoPV AS finalTeamVResultadoP,
    pF1.isDone AS final1isDone,  -- Agregado
    
    -- Equipos locales y visitantes por cada partido (Cuartos)
    eqCuartosL1.nombre AS cuartosTeamL1Nombre, eqCuartosL1.logo AS cuartosTeamL1Logo,
    eqCuartosV1.nombre AS cuartosTeamV1Nombre, eqCuartosV1.logo AS cuartosTeamV1Logo,
    
    eqCuartosL2.nombre AS cuartosTeamL2Nombre, eqCuartosL2.logo AS cuartosTeamL2Logo,
    eqCuartosV2.nombre AS cuartosTeamV2Nombre, eqCuartosV2.logo AS cuartosTeamV2Logo,
    
    eqCuartosL3.nombre AS cuartosTeamL3Nombre, eqCuartosL3.logo AS cuartosTeamL3Logo,
    eqCuartosV3.nombre AS cuartosTeamV3Nombre, eqCuartosV3.logo AS cuartosTeamV3Logo,
    
    eqCuartosL4.nombre AS cuartosTeamL4Nombre, eqCuartosL4.logo AS cuartosTeamL4Logo,
    eqCuartosV4.nombre AS cuartosTeamV4Nombre, eqCuartosV4.logo AS cuartosTeamV4Logo,
    
    -- Equipos locales y visitantes por cada partido (Semifinales)
    eqSemiL1.nombre AS semifinalesTeamL1Nombre, eqSemiL1.logo AS semifinalesTeamL1Logo,
    eqSemiV1.nombre AS semifinalesTeamV1Nombre, eqSemiV1.logo AS semifinalesTeamV1Logo,
    
    eqSemiL2.nombre AS semifinalesTeamL2Nombre, eqSemiL2.logo AS semifinalesTeamL2Logo,
    eqSemiV2.nombre AS semifinalesTeamV2Nombre, eqSemiV2.logo AS semifinalesTeamV2Logo,
    
    -- Equipos locales y visitantes por el partido (Final)
    eqFinalL.nombre AS finalTeamLNombre, eqFinalL.logo AS finalTeamLLogo,
    eqFinalV.nombre AS finalTeamVNombre, eqFinalV.logo AS finalTeamVLogo
    
  FROM torneo t
  LEFT JOIN cuartos c ON t.cuartosId = c.id
  LEFT JOIN partido pC1 ON c.partido1 = pC1.id
  LEFT JOIN partido pC2 ON c.partido2 = pC2.id
  LEFT JOIN partido pC3 ON c.partido3 = pC3.id
  LEFT JOIN partido pC4 ON c.partido4 = pC4.id
  LEFT JOIN semifinales s ON t.semifinalesId = s.id
  LEFT JOIN partido pS1 ON s.partido1 = pS1.id
  LEFT JOIN partido pS2 ON s.partido2 = pS2.id
  LEFT JOIN finales f ON t.finalesId = f.id
  LEFT JOIN partido pF1 ON f.partido1 = pF1.id
  
  -- Joins para los equipos en cuartos de final
  LEFT JOIN equipo eqCuartosL1 ON pC1.teamL = eqCuartosL1.id
  LEFT JOIN equipo eqCuartosV1 ON pC1.teamV = eqCuartosV1.id
  LEFT JOIN equipo eqCuartosL2 ON pC2.teamL = eqCuartosL2.id
  LEFT JOIN equipo eqCuartosV2 ON pC2.teamV = eqCuartosV2.id
  LEFT JOIN equipo eqCuartosL3 ON pC3.teamL = eqCuartosL3.id
  LEFT JOIN equipo eqCuartosV3 ON pC3.teamV = eqCuartosV3.id
  LEFT JOIN equipo eqCuartosL4 ON pC4.teamL = eqCuartosL4.id
  LEFT JOIN equipo eqCuartosV4 ON pC4.teamV = eqCuartosV4.id
  
  -- Joins para los equipos en semifinales
  LEFT JOIN equipo eqSemiL1 ON pS1.teamL = eqSemiL1.id
  LEFT JOIN equipo eqSemiV1 ON pS1.teamV = eqSemiV1.id
  LEFT JOIN equipo eqSemiL2 ON pS2.teamL = eqSemiL2.id
  LEFT JOIN equipo eqSemiV2 ON pS2.teamV = eqSemiV2.id
  
  -- Joins para los equipos en la final
  LEFT JOIN equipo eqFinalL ON pF1.teamL = eqFinalL.id
  LEFT JOIN equipo eqFinalV ON pF1.teamV = eqFinalV.id
  
  WHERE t.isCurrent = 1;
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return handleDBError(res, err, 'Error al obtener el torneo actual.');
    }

    if (rows.length === 0) {
      return res.status(200).json({ error: 'No se encontró un torneo actual.' });
    }

    const row = rows[0];

    // Estructurar la respuesta
    const torneoActual = {
      id: row.torneoId,
      isCurrent: row.isCurrent,
      cuartos: {
        id: row.cuartosId,
        partido1: {
          id: row.cuartosPartido1Id,
          isDone: row.cuartos1isDone,
          teamL: {
            id: row.cuartosTeamL1,
            nombre: row.cuartosTeamL1Nombre,
            logo: row.cuartosTeamL1Logo,
            resultado90: row.cuartosTeamL1Resultado90,
            resultado120: row.cuartosTeamL1Resultado120,
            resultadoP: row.cuartosTeamL1ResultadoP
          },
          teamV: {
            id: row.cuartosTeamV1,
            nombre: row.cuartosTeamV1Nombre,
            logo: row.cuartosTeamV1Logo,
            resultado90: row.cuartosTeamV1Resultado90,
            resultado120: row.cuartosTeamV1Resultado120,
            resultadoP: row.cuartosTeamV1ResultadoP
          },
        },
        partido2: {
          id: row.cuartosPartido2Id,
          isDone: row.cuartos2isDone,
          teamL: {
            id: row.cuartosTeamL2,
            nombre: row.cuartosTeamL2Nombre,
            logo: row.cuartosTeamL2Logo,
            resultado90: row.cuartosTeamL2Resultado90,
            resultado120: row.cuartosTeamL2Resultado120,
            resultadoP: row.cuartosTeamL2ResultadoP
          },
          teamV: {
            id: row.cuartosTeamV2,
            nombre: row.cuartosTeamV2Nombre,
            logo: row.cuartosTeamV2Logo,
            resultado90: row.cuartosTeamV2Resultado90,
            resultado120: row.cuartosTeamV2Resultado120,
            resultadoP: row.cuartosTeamV2ResultadoP
          },
        },
        partido3: {
          id: row.cuartosPartido3Id,
          teamL: {
            id: row.cuartosTeamL3,
            nombre: row.cuartosTeamL3Nombre,
            logo: row.cuartosTeamL3Logo,
            resultado90: row.cuartosTeamL3Resultado90,
            resultado120: row.cuartosTeamL3Resultado120,
            resultadoP: row.cuartosTeamL3ResultadoP
          },
          teamV: {
            id: row.cuartosTeamV3,
            nombre: row.cuartosTeamV3Nombre,
            logo: row.cuartosTeamV3Logo,
            resultado90: row.cuartosTeamV3Resultado90,
            resultado120: row.cuartosTeamV3Resultado120,
            resultadoP: row.cuartosTeamV3ResultadoP
          },
          isDone: row.cuartos3isDone
        },
        partido4: {
          id: row.cuartosPartido4Id,
          teamL: {
            id: row.cuartosTeamL4,
            nombre: row.cuartosTeamL4Nombre,
            logo: row.cuartosTeamL4Logo,
            resultado90: row.cuartosTeamL4Resultado90,
            resultado120: row.cuartosTeamL4Resultado120,
            resultadoP: row.cuartosTeamL4ResultadoP
          },
          teamV: {
            id: row.cuartosTeamV4,
            nombre: row.cuartosTeamV4Nombre,
            logo: row.cuartosTeamV4Logo,
            resultado90: row.cuartosTeamV4Resultado90,
            resultado120: row.cuartosTeamV4Resultado120,
            resultadoP: row.cuartosTeamV4ResultadoP
          },
          isDone: row.cuartos4isDone
        }
      },
      semifinales: {
        id: row.semifinalesId,
        partido1: {
          id: row.semifinalesPartido1Id,
          teamL: {
            id: row.semifinalesTeamL1,
            nombre: row.semifinalesTeamL1Nombre,
            logo: row.semifinalesTeamL1Logo,
            resultado90: row.semifinalesTeamL1Resultado90,
            resultado120: row.semifinalesTeamL1Resultado120,
            resultadoP: row.semifinalesTeamL1ResultadoP
          },
          teamV: {
            id: row.semifinalesTeamV1,
            nombre: row.semifinalesTeamV1Nombre,
            logo: row.semifinalesTeamV1Logo,
            resultado90: row.semifinalesTeamV1Resultado90,
            resultado120: row.semifinalesTeamV1Resultado120,
            resultadoP: row.semifinalesTeamV1ResultadoP
          },
          isDone: row.semifinales1isDone
        },
        partido2: {
          id: row.semifinalesPartido2Id,
          teamL: {
            id: row.semifinalesTeamL2,
            nombre: row.semifinalesTeamL2Nombre,
            logo: row.semifinalesTeamL2Logo,
            resultado90: row.semifinalesTeamL2Resultado90,
            resultado120: row.semifinalesTeamL2Resultado120,
            resultadoP: row.semifinalesTeamL2ResultadoP
          },
          teamV: {
            id: row.semifinalesTeamV2,
            nombre: row.semifinalesTeamV2Nombre,
            logo: row.semifinalesTeamV2Logo,
            resultado90: row.semifinalesTeamV2Resultado90,
            resultado120: row.semifinalesTeamV2Resultado120,
            resultadoP: row.semifinalesTeamV2ResultadoP
          },
          isDone: row.semifinales2isDone
        }
      },
      finales: {
        id: row.finalesId,
        partido: {
          id: row.finalPartidoId,
          teamL: {
            id: row.finalTeamL,
            nombre: row.finalTeamLNombre,
            logo: row.finalTeamLLogo,
            resultado90: row.finalTeamLResultado90,
            resultado120: row.finalTeamLResultado120,
            resultadoP: row.finalTeamLResultadoP
          },
          teamV: {
            id: row.finalTeamV,
            nombre: row.finalTeamVNombre,
            logo: row.finalTeamVLogo,
            resultado90: row.finalTeamVResultado90,
            resultado120: row.finalTeamVResultado120,
            resultadoP: row.finalTeamVResultadoP
          },
          isDone: row.final1isDone
        }
      }
    };

    res.json(torneoActual);
  });
});

app.post('/setPartido', async (req, res) => {
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
    const response = await fetch('http://localhost:5000/torneoActual');
    const torneoActual = await response.json();
    // Buscar en semifinales un partido con `teamL` o `teamV` en null
    let partidoParaActualizar = null;
    const { semifinales, finales } = torneoActual;

    const semifinalesPartidos = [semifinales.partido1, semifinales.partido2]
    for (const partido of semifinalesPartidos) {
      console.log(partido)
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
    console.log(partidoParaActualizar)
    if (partidoParaActualizar) {
      const updateQuery = `
        UPDATE partido
        SET ${partidoParaActualizar.lado} = ?
        WHERE id = ?;
      `;
      const updateValues = [ganador, partidoParaActualizar.id];

      db.run(updateQuery, updateValues, function (err) {
        if (err) {
          console.error('Error al actualizar el partido de semifinal/final:', err);
          return res.status(500).json({ error: 'Error al actualizar semifinal/final' });
        }
        console.log(`Partido de ${partidoParaActualizar.lado} actualizado correctamente.`);
      });
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

    db.run(query, values, function (err) {
      if (err) {
        console.error('Error al actualizar el partido:', err);
        return res.status(500).json({ error: 'Error al actualizar el partido' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Partido no encontrado o equipos incorrectos' });
      }

      res.json({ message: 'Partido actualizado correctamente', partidoId });
    });
  } catch (error) {
    console.error('Error al consultar el torneo actual:', error);
    return res.status(500).json({ error: 'Error al consultar el torneo actual' });
  }
});

app.post('/finalizarTorneo', (req, res) => {
  const { torneoId, equipoId } = req.body;

  if (!torneoId || !equipoId) {
    return res.status(400).json({ error: 'torneoId y equipoId son obligatorios.' });
  }

  // Iniciar una transacción para asegurar que ambas operaciones se completen o ninguna
  db.serialize(() => {
    // Actualizar el torneo para establecer isCurrent a 0
    const updateTorneoQuery = `UPDATE torneo SET isCurrent = 0 WHERE id = ?`;
    db.run(updateTorneoQuery, [torneoId], function (err) {
      if (err) {
        console.error('Error al actualizar el torneo:', err);
        return res.status(500).json({ error: 'Error al actualizar el torneo' });
      }

      // Insertar el equipo ganador en la tabla titulo
      const insertTituloQuery = `INSERT INTO titulo (equipo) VALUES (?)`;
      db.run(insertTituloQuery, [equipoId], function (err) {
        if (err) {
          console.error('Error al insertar en la tabla titulo:', err);
          return res.status(500).json({ error: 'Error al insertar en la tabla titulo' });
        }

        res.json({ message: 'Torneo finalizado correctamente', torneoId, equipoId });
      });
    });
  });
});


const handleDBError = (res, err, message) => {
  console.error(message, err);
  res.status(500).json({ error: message });
};

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
