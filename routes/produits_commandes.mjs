import { Router } from "express";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "avion",
};

const produitCommandesRouteur = Router();
const db = await mysql.createConnection(dbConfig);

produitCommandesRouteur.get("/", async (req, res) => {
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

produitCommandesRouteur.post("/", async (req, res) => {
  const { id_commande, id_produit, quantite } = req.body;
  try {
    await db.query(
      "INSERT INTO produits_commandes (id_commande, id_produit,quantite) VALUES (?, ?,?)",
      [id_commande, id_produit, quantite]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while adding the produit_commande.");
  }
});

produitCommandesRouteur.delete("/:id", async (req, res) => {
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

produitCommandesRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_commande, id_produit, quantite } = req.body;
  try {
    await db.query(
      "UPDATE produits_commandes SET id_commande = ?, id_produit = ?, quantite = ? WHERE id = ?",
      [id_commande, id_produit, quantite, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while updating the produit_commande.");
  }
});

export default produitCommandesRouteur;
