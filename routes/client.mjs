import { Router } from "express";
import mysql from "mysql2/promise";
const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "avion",
};
const clientRouteur = Router();
const db = await mysql.createConnection(dbConfig);
clientRouteur.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM clients");
  res.send(rows);
});
clientRouteur.post("/", async (req, res) => {
  const { prenom, nom, addresse } = req.body;
  await db.query(
    `INSERT INTO clients (prenom,nom,addresse) VALUES ("${prenom}","${nom}","${addresse}")`
  );
  res.sendStatus(200);
});
clientRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query(`DELETE FROM clients WHERE id=${id}`);
  res.sendStatus(200);
});
clientRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { prenom, nom, addresse } = req.body;
  await db.query(
    `UPDATE clients SET prenom="${prenom}", nom="${nom}", addresse="${addresse}" WHERE id=${id}`
  );
  res.sendStatus(200);
});
export default clientRouteur;
