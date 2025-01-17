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
  const [rows] = await db.query("SELECT * FROM produits_commandes");
  res.send(rows);
});
produitRouteur.post("/", async (req, res) => {
  const { id_commande, id_produit } = req.body;
  await db.query(
    `INSERT INTO produits_commandes (id_commande,id_produit,) VALUES ("${id_commande}","${id_produit}")`
  );
  res.sendStatus(200);
});
produitRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query(`DELETE FROM produits_commandes WHERE id=${id}`);
  res.sendStatus(200);
});
produitRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_commande, id_produit } = req.body;
  await db.query(
    `UPDATE produits_commandes SET id_commande="${id_commande}", id_produit="${id_produit}" WHERE id=${id}`
  );
  res.sendStatus(200);
});
export default produitRouteur;
