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

export default clientRouteur;
