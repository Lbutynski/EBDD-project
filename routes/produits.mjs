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
    const [rows] = await db.query("SELECT * FROM produits");
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching products.");
  }
});

produitRouteur.post("/", async (req, res) => {
  const { nom, prix, quantité_en_stock, categorie_id } = req.body;
  try {
    await db.query(
      "INSERT INTO produits (nom, prix, quantité_en_stock, categorie_id) VALUES (?, ?, ?, ?)",
      [nom, prix, quantité_en_stock, categorie_id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the product.");
  }
});

produitRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM produits WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the product.");
  }
});

produitRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nom, prix, quantité_en_stock, categorie_id } = req.body;
  try {
    await db.query(
      "UPDATE produits SET nom = ?, prix = ?, quantité_en_stock = ?, categorie_id = ? WHERE id = ?",
      [nom, prix, quantité_en_stock, categorie_id, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the product.");
  }
});
produitRouteur.get("/:id/commandes", async (req, res) => {
  const produitId = req.params.id;

  try {
    const query = `
      SELECT 
        c.id AS id_commande,
        c.id_client,
        c.date_commande,
        cl.prenom AS client_prenom,
        cl.nom AS client_nom,
        pc.id_produit,
        p.nom AS produit_nom,
        p.prix AS produit_prix
      FROM commandes c
      LEFT JOIN produits_commandes pc ON c.id = pc.id_commande
      LEFT JOIN produits p ON pc.id_produit = p.id
      LEFT JOIN clients cl ON c.id_client = cl.id
      WHERE pc.id_produit = ?
      ORDER BY c.date_commande ASC
    `;

    const [rows] = await db.query(query, [produitId]);

    if (rows.length === 0) {
      return res.status(404).send("No commandes found for this product.");
    }

    const results = {};
    rows.forEach((row) => {
      if (!results[row.id_commande]) {
        results[row.id_commande] = {
          id_commande: row.id_commande,
          id_client: row.id_client,
          client_name: `${row.client_prenom} ${row.client_nom}`,
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

    const resultsArray = Object.values(results);

    res.send(resultsArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching commandes of products.");
  }
});
produitRouteur.get("/stock-faible", async (req, res) => {
  const seuil = parseInt(req.query.seuil);

  if (!seuil || seuil <= 0) {
    return res.status(400).send("Please provide a valid threshold (seuil).");
  }

  try {
    const [rows] = await db.query(
      "SELECT id, nom, quantité_en_stock FROM produits WHERE quantité_en_stock < ?",
      [seuil]
    );

    if (rows.length === 0) {
      return res.status(404).send("No products with low stock found.");
    }

    res.send(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching low stock products.");
  }
});

export default produitRouteur;
