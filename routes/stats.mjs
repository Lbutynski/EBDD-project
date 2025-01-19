import { Router } from "express";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "avion",
};

const statsRouteur = Router();
const db = await mysql.createConnection(dbConfig);

statsRouteur.get("/most-sold-products", async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id AS id_produit,
        p.nom AS produit_nom,
        SUM(pc.quantite) AS total_quantite,
        SUM(pc.quantite * p.prix) AS total_revenue
      FROM produits_commandes pc
      JOIN produits p ON pc.id_produit = p.id
      GROUP BY p.id, p.nom
      ORDER BY total_quantite DESC
      LIMIT 10
    `;

    const [rows] = await db.query(query);
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching statistics.");
  }
});
statsRouteur.get("/sales", async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).send("Please provide a valid start and end date.");
  }

  try {
    const query = `
      SELECT 
        SUM(pc.quantite * p.prix) AS total_revenue,
        COUNT(DISTINCT c.id) AS total_commandes
      FROM commandes c
      JOIN produits_commandes pc ON c.id = pc.id_commande
      JOIN produits p ON pc.id_produit = p.id
      WHERE c.date_commande BETWEEN ? AND ?
    `;

    const [rows] = await db.query(query, [start, end]);
    res.send(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching statistics.");
  }
});

export default statsRouteur;
