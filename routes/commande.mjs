import { Router } from "express";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "avion",
};

const commandeRouteur = Router();
const db = await mysql.createConnection(dbConfig);

commandeRouteur.get("/", async (req, res) => {
  try {
    const start = req.params.start;
    const end = req.params.end;
    const querry = `SELECT 
        c.id AS id_commande,
        c.id_client,
        c.date_commande,
        pc.id AS id_produit_commande,
        pc.id_produit,
        p.nom AS produit_nom,
        p.prix AS produit_prix
      FROM commandes c
      JOIN produits_commandes pc ON pc.id_commande = c.id
      JOIN produits p ON pc.id_produit = p.id`;
    if (start && end) {
      (querry += ` WHERE c.date_commande BETWEEN ? AND ?`), [start, end];
    }
    const [rows] = await db.query(querry);
    const results = {};
    rows.forEach((row) => {
      if (!results[row.id_commande]) {
        results[row.id_commande] = {
          id_commande: row.id_commande,
          id_client: row.id_client,
          date_commande: row.date_commande,
          produits: [],
        };
      }
      results[row.id_commande].produits.push({
        id_produit: row.id_produit,
        nom: row.produit_nom,
        prix: row.produit_prix,
      });
    });
    res.send(Object.values(results));
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching commandes.");
  }
});

commandeRouteur.post("/", async (req, res) => {
  const { id_client } = req.body;
  try {
    await db.query("INSERT INTO commandes (id_client) VALUES (?)", [id_client]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the commande.");
  }
});

commandeRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM commandes WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the commande.");
  }
});

commandeRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_client } = req.body;
  try {
    await db.query("UPDATE commandes SET id_client = ? WHERE id = ?", [
      id_client,
      id,
    ]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the commande.");
  }
});

export default commandeRouteur;
