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
  try {
    const [rows] = await db.query("SELECT * FROM produits_commandes");
    res.send(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching produits_commandes.");
  }
});

produitRouteur.post("/", async (req, res) => {
  const { id_commande, id_produit } = req.body;
  try {
    await db.query(
      "INSERT INTO produits_commandes (id_commande, id_produit,quantite) VALUES (?, ?,?)",
      [id_commande, id_produit]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while adding the produit_commande.");
  }
});

produitRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM produits_commandes WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while deleting the produit_commande.");
  }
});

produitRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_commande, id_produit } = req.body;
  try {
    await db.query(
      "UPDATE produits_commandes SET id_commande = ?, id_produit = ? WHERE id = ?",
      [id_commande, id_produit, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while updating the produit_commande.");
  }
});

export default produitRouteur;
