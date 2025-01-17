import { Router } from "express";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "avion",
};

const categorieRouteur = Router();
const db = await mysql.createConnection(dbConfig);

categorieRouteur.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching categories.");
  }
});

categorieRouteur.post("/", async (req, res) => {
  const { nom } = req.body;
  try {
    await db.query("INSERT INTO categories (nom) VALUES (?)", [nom]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the category.");
  }
});

categorieRouteur.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM categories WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the category.");
  }
});

categorieRouteur.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  try {
    await db.query("UPDATE categories SET nom = ? WHERE id = ?", [nom, id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the category.");
  }
});

export default categorieRouteur;
