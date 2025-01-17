import { Router } from "express";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "avion",
};

const fournisseurRouteur = Router();
const db = await mysql.createConnection(dbConfig);

fournisseurRouteur.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM fournisseur");
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching fournisseurs.");
  }
});

fournisseurRouteur.post("/", async (req, res) => {
  const { nom } = req.body;
  try {
    await db.query("INSERT INTO fournisseur (nom) VALUES (?)", [nom]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the fournisseur.");
  }
});

fournisseurRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM fournisseur WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the fournisseur.");
  }
});

fournisseurRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  try {
    await db.query("UPDATE fournisseur SET nom = ? WHERE id = ?", [nom, id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the fournisseur.");
  }
});

export default fournisseurRouteur;
