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

export default produitRouteur;
