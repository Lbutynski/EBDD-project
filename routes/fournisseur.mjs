import { Router } from "express";
import mysql from "mysql2/promise";
const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "avion",
};
const fournisseurRouteur = Router();
const db = await mysql.createConnection(dbConfig);
fournisseurRouteur.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM fournisseur");
  res.send(rows);
});
fournisseurRouteur.post("/", async (req, res) => {
  const { nom } = req.body;
  await db.query(`INSERT INTO fournisseur (nom) VALUES ("${nom}")`);
  res.sendStatus(200);
});
fournisseurRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query(`DELETE FROM fournisseur WHERE id=${id}`);
  res.sendStatus(200);
});
fournisseurRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  await db.query(`UPDATE fournisseur SET nom="${nom}" WHERE id=${id}`);
  res.sendStatus(200);
});
export default fournisseurRouteur;
