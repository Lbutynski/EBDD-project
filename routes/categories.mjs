import { Router } from "express";
import mysql from "mysql2/promise";
const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "avion",
};
const categorieRouteur = Router();
const db = await mysql.createConnection(dbConfig);
categorieRouteur.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categories");
  res.send(rows);
});
categorieRouteur.post("/", async (req, res) => {
  const { nom } = req.body;
  await db.query(`INSERT INTO categories (nom) VALUES ("${nom}")`);
  res.sendStatus(200);
});
categorieRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query(`DELETE FROM categories WHERE id=${id}`);
  res.sendStatus(200);
});
categorieRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  await db.query(`UPDATE categories SET nom="${nom}" WHERE id=${id}`);
  res.sendStatus(200);
});
export default categorieRouteur;
