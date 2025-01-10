import { Router } from "express";
import mysql from "mysql2/promise";
const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "avion",
};
const produitRouteur = Router();
const db = await mysql.createConnection(dbConfig);
produitRouteur.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM produits");
  res.send(rows);
});
produitRouteur.post("/", async (req, res) => {
  const { nom, prix, quantité_en_stock, categorie_id } = req.body;
  await db.query(
    `INSERT INTO produits (nom,prix,quantité_en_stock,categorie_id) VALUES ("${nom}","${prix}","${quantité_en_stock}","${categorie_id}")`
  );
  res.sendStatus(200);
});
produitRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query(`DELETE FROM produits WHERE id=${id}`);
  res.sendStatus(200);
});
produitRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nom, prix, quantité_en_stock, categorie_id } = req.body;
  await db.query(
    `UPDATE produits SET nom="${nom}", prix="${prix}", quantité_en_stock="${quantité_en_stock}", categorie_id=${categorie_id} WHERE id=${id}`
  );
  res.sendStatus(200);
});
export default produitRouteur;
