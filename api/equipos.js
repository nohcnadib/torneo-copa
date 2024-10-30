const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

// Handler para el endpoint /api/equipos
module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const sql = `
      SELECT e.*, 
        (SELECT COUNT(*) FROM titulo WHERE equipo = e.id) AS titulos,
        (SELECT COUNT(*) 
          FROM partido
          WHERE isDone = 1 AND (
            (teamL = e.id AND (resultado90L + resultado120L) > (resultado90V + resultado120V)) OR 
            (teamV = e.id AND (resultado90V + resultado120V) > (resultado90L + resultado120L))
          )) AS partidos_ganados,
        (SELECT SUM(CASE 
            WHEN teamL = e.id THEN resultado90L + resultado120L 
            WHEN teamV = e.id THEN resultado90V + resultado120V 
            ELSE 0 END
          ) 
          FROM partido
          WHERE isDone = 1
        ) AS goles_favor
      FROM equipo e;
    `;
    try {
      const { rows } = await client.execute(sql);
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
