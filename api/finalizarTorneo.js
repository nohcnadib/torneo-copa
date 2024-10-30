const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

// Handler para el endpoint /api/equipos
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { torneoId, equipoId } = req.body;

    if (!torneoId || !equipoId) {
        return res.status(400).json({ error: 'torneoId y equipoId son obligatorios.' });
    }

    try {
        try {
            // Iniciar una transacción con Turso
            await client.execute({ sql: 'BEGIN;' });
        
            // Actualizar el torneo para establecer isCurrent a 0
            const updateTorneoQuery = `UPDATE torneo SET isCurrent = 0 WHERE id = ?`;
            const updateResult = await client.execute({
                sql: updateTorneoQuery,
                args: [torneoId]
            });
        
            if (updateResult.rowsAffected === 0) {
                await client.execute({ sql: 'ROLLBACK;' });
                return res.status(500).json({ error: 'Error al actualizar el torneo o torneo no encontrado' });
            }
        
            // Insertar el equipo ganador en la tabla titulo
            const insertTituloQuery = `INSERT INTO titulo (equipo) VALUES (?)`;
            const insertResult = await client.execute({
                sql: insertTituloQuery,
                args: [equipoId]
            });
        
            if (insertResult.rowsAffected === 0) {
                await client.execute({ sql: 'ROLLBACK;' });
                return res.status(500).json({ error: 'Error al insertar en la tabla titulo' });
            }
        
            // Confirmar ambas operaciones si todo fue exitoso
            await client.execute({ sql: 'COMMIT;' });
            res.json({ message: 'Torneo finalizado correctamente', torneoId, equipoId });
        
        } catch (err) {
            // Revertir la transacción en caso de error
            await client.execute({ sql: 'ROLLBACK;' });
            console.error("Error al ejecutar la consulta:", err);
            res.status(500).json({ error: "Error al finalizar el torneo" });
        }
    } catch (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al obtener los equipos" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
