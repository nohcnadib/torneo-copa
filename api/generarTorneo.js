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
      // Agregar aquí la serialización
      const result = await client.execute(`
        INSERT INTO partido (teamL, teamV) VALUES 
        (?, ?), (?, ?), (?, ?), (?, ?)
      `, [
        shuffledTeams[0], shuffledTeams[1], 
        shuffledTeams[2], shuffledTeams[3], 
        shuffledTeams[4], shuffledTeams[5], 
        shuffledTeams[6], shuffledTeams[7]
      ]);

      // Obtener el último ID insertado
      const lastInsertedId = result.lastID; // Cambié a result.lastID para obtener el último ID

      const cuartosIds = [
        lastInsertedId - 3,
        lastInsertedId - 2,
        lastInsertedId - 1,
        lastInsertedId
      ];

      console.log("cuartosIds")
      console.log(cuartosIds)
      // Insertar en la tabla `cuartos`
      const { lastID: cuartosId } = await client.execute(`
        INSERT INTO cuartos (partido1, partido2, partido3, partido4) VALUES (?, ?, ?, ?)
      `, [...cuartosIds]);

      // Crear partidos de semifinales (sin definir teams todavía)
      const { lastID: semifinalesIds } = await client.execute(`
        INSERT INTO partido (teamL, teamV) VALUES (NULL, NULL), (NULL, NULL)
      `);

      console.log("semifinalesIds")
      console.log(semifinalesIds)
      // Insertar en la tabla `semifinales`
      const { lastID: semifinalesId } = await client.execute(`
        INSERT INTO semifinales (partido1, partido2) VALUES (?, ?)
      `, [semifinalesIds - 1, semifinalesIds]);

      // Crear partido de la final (sin definir teams)
      const { lastID: finalId } = await client.execute(`
        INSERT INTO partido (teamL, teamV) VALUES (NULL, NULL)
      `);
      console.log("finalId")
      console.log(finalId)

      // Insertar en la tabla `finales`
      const { lastID: finalTorneoId } = await client.execute(`
        INSERT INTO finales (partido1) VALUES (?)
      `, [finalId]);

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
