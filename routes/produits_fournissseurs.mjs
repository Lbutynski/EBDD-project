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
  const [rows] = await db.query("SELECT * FROM produits_fournisseurs");
  res.send(rows);
});
produitRouteur.post("/", async (req, res) => {
  const { id_commande, id_fournisseur } = req.body;
  await db.query(
    `INSERT INTO produits_fournisseurs (id_commande,id_fournisseur,) VALUES ("${id_commande}","${id_fournisseur}")`
  );
  res.sendStatus(200);
});
produitRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query(`DELETE FROM produits_fournisseurs WHERE id=${id}`);
  res.sendStatus(200);
});
produitRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_commande, id_fournisseur } = req.body;
  await db.query(
    `UPDATE produits_fournisseurs SET id_commande="${id_commande}", id_fournisseur="${id_fournisseur}" WHERE id=${id}`
  );
  res.sendStatus(200);
});
export default produitRouteur;
