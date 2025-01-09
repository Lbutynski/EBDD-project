import express from "express";
import cors from "cors";
import "dotenv/config";
import mysql from "mysql2/promise";
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
const db = await mysql.createConnection(dbConfig);
app.get("/api/client", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM clients");
  res.send(rows);
});
app.post("/api/client", async (req, res) => {
  const { prenom, nom, addresse } = req.body;
  await db.query(
    `INSERT INTO clients (prenom,nom,addresse) VALUES ("${prenom}","${nom}","${addresse}")`
  );
  res.sendStatus(200);
});
app.delete("/api/client/:id", async (req, res) => {
  const { id } = req.params;
  await db.query(`DELETE FROM clients WHERE id=${id}`);
  res.sendStatus(200);
});
app.put("/api/client/:id", async (req, res) => {
  const { id } = req.params;
  const { prenom, nom, addresse } = req.body;
  await db.query(
    `UPDATE clients SET prenom="${prenom}", nom="${nom}", addresse="${addresse}" WHERE id=${id}`
  );
  res.sendStatus(200);
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
