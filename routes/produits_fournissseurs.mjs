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
    const [rows] = await db.query("SELECT * FROM produits_fournisseurs");
    res.send(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching produits_fournisseurs.");
  }
});

produitRouteur.post("/", async (req, res) => {
  const { id_commande, id_fournisseur } = req.body;
  try {
    await db.query(
      "INSERT INTO produits_fournisseurs (id_commande, id_fournisseur) VALUES (?, ?)",
      [id_commande, id_fournisseur]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while adding to produits_fournisseurs.");
  }
});

produitRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM produits_fournisseurs WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while deleting from produits_fournisseurs.");
  }
});

produitRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_commande, id_fournisseur } = req.body;
  try {
    await db.query(
      "UPDATE produits_fournisseurs SET id_commande = ?, id_fournisseur = ? WHERE id = ?",
      [id_commande, id_fournisseur, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while updating produits_fournisseurs.");
  }
});

export default produitRouteur;
