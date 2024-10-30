const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

// Handler para el endpoint /api/generarTorneo
module.exports = async (req, res) => {
  if (req.method === 'POST') { // Cambiado a POST
    const { teamIds } = req.body;
    if (!Array.isArray(teamIds) || teamIds.length !== 8) {
      return res.status(400).json({ error: 'Se deben seleccionar exactamente 8 equipos.' });
    }
    // Barajar los equipos para los cuartos de final
    const shuffledTeams = teamIds.sort(() => Math.random() - 0.5);
    
    try {
      // Insertar los partidos de cuartos en la tabla `partido`
      const resultCuartos = await client.execute(`
        INSERT INTO partido (teamL, teamV) VALUES 
        (?, ?), (?, ?), (?, ?), (?, ?)
      `, [
        shuffledTeams[0], shuffledTeams[1], 
        shuffledTeams[2], shuffledTeams[3], 
        shuffledTeams[4], shuffledTeams[5], 
        shuffledTeams[6], shuffledTeams[7]
      ]);

      // Obtener el último ID de partido insertado como entero
      const lastInsertedId = Number(resultCuartos.lastInsertRowid);
      console.log("ID del último partido insertado (cuartos):", lastInsertedId);

      // Calcular los IDs de los partidos de cuartos
      const cuartosIds = [
        lastInsertedId - 3,
        lastInsertedId - 2,
        lastInsertedId - 1,
        lastInsertedId
      ];

      console.log("IDs de cuartos:", cuartosIds);

      // Insertar en la tabla `cuartos`
      const resultCuartosTable = await client.execute(`
        INSERT INTO cuartos (partido1, partido2, partido3, partido4) VALUES (?, ?, ?, ?)
      `, [...cuartosIds]);

      const cuartosId = Number(resultCuartosTable.lastInsertRowid);
      console.log("ID de la entrada en cuartos:", cuartosId);

      // Crear partidos de semifinales (sin definir equipos todavía)
      const resultSemifinales = await client.execute(`
        INSERT INTO partido (teamL, teamV) VALUES (NULL, NULL), (NULL, NULL)
      `);

      const lastSemifinalesId = Number(resultSemifinales.lastInsertRowid);
      const semifinalesIds = [lastSemifinalesId - 1, lastSemifinalesId];
      console.log("IDs de semifinales:", semifinalesIds);

      // Insertar en la tabla `semifinales`
      const resultSemifinalesTable = await client.execute(`
        INSERT INTO semifinales (partido1, partido2) VALUES (?, ?)
      `, [...semifinalesIds]);

      const semifinalesId = Number(resultSemifinalesTable.lastInsertRowid);
      console.log("ID de la entrada en semifinales:", semifinalesId);

      // Crear partido de la final (sin definir equipos)
      const resultFinal = await client.execute(`
        INSERT INTO partido (teamL, teamV) VALUES (NULL, NULL)
      `);

      const finalId = Number(resultFinal.lastInsertRowid);
      console.log("ID del partido final insertado:", finalId);

      // Insertar en la tabla `finales`
      const resultFinalTable = await client.execute(`
        INSERT INTO finales (partido1) VALUES (?)
      `, [finalId]);

      const finalTorneoId = Number(resultFinalTable.lastInsertRowid);
      console.log("ID de la entrada en finales:", finalTorneoId);

      // Insertar en la tabla del torneo
      await client.execute(`
        INSERT INTO torneo (cuartosId, semifinalesId, finalesId, isCurrent) 
        VALUES (?, ?, ?, 1)
      `, [cuartosId, semifinalesId, finalTorneoId]);

      res.status(200).json({ message: 'Torneo generado exitosamente.' });
      
    } catch (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al generar el torneo" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
