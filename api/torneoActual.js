const express = require('express');
const db = require('./database'); // Asegúrate de que este sea tu archivo de conexión a la base de datos
const handleDBError = require('./handleDBError'); // Manejo de errores de base de datos

const router = express.Router();

// Endpoint para obtener el torneo actual
router.get('/', (req, res) => {
  const query = `
    SELECT t.id AS torneoId, t.isCurrent,
      -- Joins para cuartos de final
      pC1.id AS cuartosId, pC1.teamL AS cuartosTeamL1, eqCuartosL1.nombre AS cuartosTeamL1Nombre, eqCuartosL1.logo AS cuartosTeamL1Logo,
      pC1.teamV AS cuartosTeamV1, eqCuartosV1.nombre AS cuartosTeamV1Nombre, eqCuartosV1.logo AS cuartosTeamV1Logo,
      pC1.resultado90L AS cuartosTeamL1Resultado90, pC1.resultado120L AS cuartosTeamL1Resultado120, pC1.resultadoPL AS cuartosTeamL1ResultadoP,
      pC1.isDone AS cuartos1isDone,
      
      pC2.id AS cuartosId, pC2.teamL AS cuartosTeamL2, eqCuartosL2.nombre AS cuartosTeamL2Nombre, eqCuartosL2.logo AS cuartosTeamL2Logo,
      pC2.teamV AS cuartosTeamV2, eqCuartosV2.nombre AS cuartosTeamV2Nombre, eqCuartosV2.logo AS cuartosTeamV2Logo,
      pC2.resultado90L AS cuartosTeamL2Resultado90, pC2.resultado120L AS cuartosTeamL2Resultado120, pC2.resultadoPL AS cuartosTeamL2ResultadoP,
      pC2.isDone AS cuartos2isDone,
      
      pC3.id AS cuartosId, pC3.teamL AS cuartosTeamL3, eqCuartosL3.nombre AS cuartosTeamL3Nombre, eqCuartosL3.logo AS cuartosTeamL3Logo,
      pC3.teamV AS cuartosTeamV3, eqCuartosV3.nombre AS cuartosTeamV3Nombre, eqCuartosV3.logo AS cuartosTeamV3Logo,
      pC3.resultado90L AS cuartosTeamL3Resultado90, pC3.resultado120L AS cuartosTeamL3Resultado120, pC3.resultadoPL AS cuartosTeamL3ResultadoP,
      pC3.isDone AS cuartos3isDone,
      
      pC4.id AS cuartosId, pC4.teamL AS cuartosTeamL4, eqCuartosL4.nombre AS cuartosTeamL4Nombre, eqCuartosL4.logo AS cuartosTeamL4Logo,
      pC4.teamV AS cuartosTeamV4, eqCuartosV4.nombre AS cuartosTeamV4Nombre, eqCuartosV4.logo AS cuartosTeamV4Logo,
      pC4.resultado90L AS cuartosTeamL4Resultado90, pC4.resultado120L AS cuartosTeamL4Resultado120, pC4.resultadoPL AS cuartosTeamL4ResultadoP,
      pC4.isDone AS cuartos4isDone,
      
      -- Joins para semifinales
      pS1.id AS semifinalesId, pS1.teamL AS semifinalesTeamL1, eqSemiL1.nombre AS semifinalesTeamL1Nombre, eqSemiL1.logo AS semifinalesTeamL1Logo,
      pS1.teamV AS semifinalesTeamV1, eqSemiV1.nombre AS semifinalesTeamV1Nombre, eqSemiV1.logo AS semifinalesTeamV1Logo,
      pS1.resultado90L AS semifinalesTeamL1Resultado90, pS1.resultado120L AS semifinalesTeamL1Resultado120, pS1.resultadoPL AS semifinalesTeamL1ResultadoP,
      pS1.isDone AS semifinales1isDone,
      
      pS2.id AS semifinalesId, pS2.teamL AS semifinalesTeamL2, eqSemiL2.nombre AS semifinalesTeamL2Nombre, eqSemiL2.logo AS semifinalesTeamL2Logo,
      pS2.teamV AS semifinalesTeamV2, eqSemiV2.nombre AS semifinalesTeamV2Nombre, eqSemiV2.logo AS semifinalesTeamV2Logo,
      pS2.resultado90L AS semifinalesTeamL2Resultado90, pS2.resultado120L AS semifinalesTeamL2Resultado120, pS2.resultadoPL AS semifinalesTeamL2ResultadoP,
      pS2.isDone AS semifinales2isDone,
      
      -- Joins para la final
      pF1.id AS finalesId, pF1.teamL AS finalTeamL, eqFinalL.nombre AS finalTeamLNombre, eqFinalL.logo AS finalTeamLLogo,
      pF1.teamV AS finalTeamV, eqFinalV.nombre AS finalTeamVNombre, eqFinalV.logo AS finalTeamVLogo,
      pF1.resultado90L AS finalTeamLResultado90, pF1.resultado120L AS finalTeamLResultado120, pF1.resultadoPL AS finalTeamLResultadoP,
      pF1.isDone AS final1isDone
    FROM torneo t
    LEFT JOIN cuartos pC1 ON t.id = pC1.torneoId
    LEFT JOIN cuartos pC2 ON t.id = pC2.torneoId
    LEFT JOIN cuartos pC3 ON t.id = pC3.torneoId
    LEFT JOIN cuartos pC4 ON t.id = pC4.torneoId
    LEFT JOIN semifinales pS1 ON t.id = pS1.torneoId
    LEFT JOIN semifinales pS2 ON t.id = pS2.torneoId
    LEFT JOIN finales pF1 ON t.id = pF1.torneoId
    
    -- Joins para los equipos en cuartos
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
    
    WHERE t.isCurrent = 1
  `;

  db.all(query, (err, rows) => {
    if (err) {
      return handleDBError(err, res);
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontró el torneo actual." });
    }

    const response = {
      torneo: {
        id: rows[0].torneoId,
        isCurrent: rows[0].isCurrent,
        cuartos: [],
        semifinales: [],
        finales: null,
      }
    };

    // Construir los cuartos de final
    for (let i = 0; i < 4; i++) {
      const cuartos = rows[i];
      response.torneo.cuartos.push({
        id: cuartos.cuartosId,
        partido1: {
          id: cuartos.cuartosId,
          teamL: {
            id: cuartos.cuartosTeamL1,
            nombre: cuartos.cuartosTeamL1Nombre,
            logo: cuartos.cuartosTeamL1Logo,
          },
          teamV: {
            id: cuartos.cuartosTeamV1,
            nombre: cuartos.cuartosTeamV1Nombre,
            logo: cuartos.cuartosTeamV1Logo,
          },
          resultados: {
            teamL: {
              resultado90: cuartos.cuartosTeamL1Resultado90,
              resultado120: cuartos.cuartosTeamL1Resultado120,
              resultadoP: cuartos.cuartosTeamL1ResultadoP,
            },
            teamV: {
              resultado90: cuartos.cuartosTeamV1Resultado90,
              resultado120: cuartos.cuartosTeamV1Resultado120,
              resultadoP: cuartos.cuartosTeamV1ResultadoP,
            },
          },
          isDone: cuartos.cuartos1isDone,
        }
      });
    }

    // Construir las semifinales
    for (let i = 4; i < 6; i++) {
      const semifinales = rows[i];
      response.torneo.semifinales.push({
        id: semifinales.semifinalesId,
        teamL: {
          id: semifinales.semifinalesTeamL1,
          nombre: semifinales.semifinalesTeamL1Nombre,
          logo: semifinales.semifinalesTeamL1Logo,
        },
        teamV: {
          id: semifinales.semifinalesTeamV1,
          nombre: semifinales.semifinalesTeamV1Nombre,
          logo: semifinales.semifinalesTeamV1Logo,
        },
        resultados: {
          teamL: {
            resultado90: semifinales.semifinalesTeamL1Resultado90,
            resultado120: semifinales.semifinalesTeamL1Resultado120,
            resultadoP: semifinales.semifinalesTeamL1ResultadoP,
          },
          teamV: {
            resultado90: semifinales.semifinalesTeamV1Resultado90,
            resultado120: semifinales.semifinalesTeamV1Resultado120,
            resultadoP: semifinales.semifinalesTeamV1ResultadoP,
          },
        },
        isDone: semifinales.semifinales1isDone,
      });
    }

    // Construir la final
    const final = rows[6];
    response.torneo.finales = {
      id: final.finalesId,
      teamL: {
        id: final.finalTeamL,
        nombre: final.finalTeamLNombre,
        logo: final.finalTeamLLogo,
      },
      teamV: {
        id: final.finalTeamV,
        nombre: final.finalTeamVNombre,
        logo: final.finalTeamVLogo,
      },
      resultados: {
        teamL: {
          resultado90: final.finalTeamLResultado90,
          resultado120: final.finalTeamLResultado120,
          resultadoP: final.finalTeamLResultadoP,
        },
        teamV: {
          resultado90: final.finalTeamVResultado90,
          resultado120: final.finalTeamVResultado120,
          resultadoP: final.finalTeamVResultadoP,
        },
      },
      isDone: final.final1isDone,
    };

    res.json(response);
  });
});

module.exports = router;
