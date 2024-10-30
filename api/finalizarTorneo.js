const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

// Handler para el endpoint /api/finalizarTorneo
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { torneoId, equipoId } = req.body;

    if (!torneoId || !equipoId) {
      return res.status(400).json({ error: 'torneoId y equipoId son obligatorios.' });
    }

    console.log("Datos recibidos - torneoId:", torneoId, "equipoId:", equipoId);

    // Iniciar una transacción explícita
    console.log("Iniciando transacción...");
    await client.execute('BEGIN TRANSACTION;');

    try {
    // Actualizar el torneo para establecer isCurrent a 0
    const updateTorneoQuery = `UPDATE torneo SET isCurrent = 0 WHERE id = ?`;
    console.log("Ejecutando consulta de actualización del torneo:", updateTorneoQuery);
    const updateResult = await client.execute({
        sql: updateTorneoQuery,
        args: [torneoId]
    });

    console.log("Resultado de la actualización del torneo:", updateResult);

    if (updateResult.rowsAffected === 0) {
        console.log("No se encontró el torneo o no se pudo actualizar.");
        await client.execute('ROLLBACK;');
        return res.status(500).json({ error: 'Error al actualizar el torneo o torneo no encontrado' });
    }

    // Insertar el equipo ganador en la tabla titulo
    const insertTituloQuery = `INSERT INTO titulo (equipo) VALUES (?)`;
    console.log("Ejecutando consulta de inserción en título:", insertTituloQuery);
    const insertResult = await client.execute({
        sql: insertTituloQuery,
        args: [equipoId]
    });

    console.log("Resultado de la inserción en título:", insertResult);

    if (insertResult.rowsAffected === 0) {
        console.log("Error al insertar el equipo en la tabla título.");
        await client.execute('ROLLBACK;');
        return res.status(500).json({ error: 'Error al insertar en la tabla titulo' });
    }

    // Confirmar ambas operaciones si todo fue exitoso
    console.log("Confirmando transacción...");
    await client.execute('COMMIT;');
    console.log("Transacción confirmada exitosamente.");

    res.json({ message: 'Torneo finalizado correctamente', torneoId, equipoId });

    } catch (err) {
    // Revertir la transacción en caso de error
    console.error("Error en la transacción, haciendo rollback:", err);
    await client.execute('ROLLBACK;');
    res.status(500).json({ error: "Error al finalizar el torneo" });
    }

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
