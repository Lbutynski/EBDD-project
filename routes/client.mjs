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
  try {
    const [rows] = await db.query("SELECT * FROM clients");
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching clients.");
  }
});

clientRouteur.post("/", async (req, res) => {
  const { prenom, nom, addresse } = req.body;
  try {
    await db.query(
      "INSERT INTO clients (prenom, nom, addresse) VALUES (?, ?, ?)",
      [prenom, nom, addresse]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the client.");
  }
});

clientRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM clients WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the client.");
  }
});

clientRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { prenom, nom, addresse } = req.body;
  try {
    await db.query(
      "UPDATE clients SET prenom = ?, nom = ?, addresse = ? WHERE id = ?",
      [prenom, nom, addresse, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the client.");
  }
});

clientRouteur.get("/:id/commandes", async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        c.id AS id_commande,
        c.date_commande,
        pc.id_produit,
        p.nom AS produit_nom,
        p.prix AS produit_prix
      FROM commandes c
      LEFT JOIN produits_commandes pc ON c.id = pc.id_commande
      LEFT JOIN produits p ON pc.id_produit = p.id
      WHERE c.id_client = ?
      ORDER BY c.date_commande ASC
    `;

    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).send("No commandes found for this client.");
    }

    const results = {};
    rows.forEach((row) => {
      if (!results[row.id_commande]) {
        results[row.id_commande] = {
          id_commande: row.id_commande,
          date_commande: row.date_commande,
          produits: [],
        };
      }

      if (row.id_produit) {
        results[row.id_commande].produits.push({
          id_produit: row.id_produit,
          nom: row.produit_nom,
          prix: row.produit_prix,
        });
      }
    });

    const resultsArray = Object.values(results);

    res.send(resultsArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching commandes of client.");
  }
});
export default clientRouteur;
