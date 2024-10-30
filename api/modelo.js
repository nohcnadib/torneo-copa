const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

// Handler para el endpoint /api/equipos
module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const sql = `
      
    `;
    try {
      const { rows } = await client.execute(sql);
      
      if (rows.length === 0) {
        return res.status(200).json({ error: 'No se encontró un torneo actual.' });
      }
      
      res.status(200).json(rows); // Asegúrate de devolver un código 200 en caso de éxito
    } catch (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al obtener los equipos" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
