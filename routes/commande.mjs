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
  const { id_client, date_commande } = req.body;
  try {
    await db.query(
      "INSERT INTO commandes (id_client,date_commande) VALUES (?,?)",
      [id_client, date_commande]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while adding the commande.");
  }
});
commandeRouteur.post("/commandes", async (req, res) => {
  const { clientId, produits } = req.body;

  const insufficientStockProducts = [];
  for (const produit of produits) {
    const [product] = await db.query(
      "SELECT quantité_en_stock FROM produits WHERE id = ?",
      [produit.id]
    );

    if (product[0].quantité_en_stock < produit.quantite) {
      insufficientStockProducts.push(produit.id);
    }
  }

  if (insufficientStockProducts.length > 0) {
    return res.status(400).send({
      message: `Insufficient stock for products with IDs: ${insufficientStockProducts.join(
        ", "
      )}`,
    });
  }

  try {
    await db.beginTransaction();

    const [result] = await db.query(
      "INSERT INTO commandes (id_client) VALUES (?)",
      [clientId]
    );
    const commandeId = result.insertId;

    for (const produit of produits) {
      await db.query(
        "INSERT INTO produits_commandes (id_commande, id_produit, quantite) VALUES (?, ?, ?)",
        [commandeId, produit.id, produit.quantite]
      );

      await db.query(
        "UPDATE produits SET quantité_en_stock = quantité_en_stock - ? WHERE id = ?",
        [produit.quantite, produit.id]
      );
    }

    await db.commit();

    res.status(201).send({ message: "Order created successfully!" });
  } catch (error) {
    await db.rollback();
    console.error(error);
    res.status(500).send("An error occurred while creating the order.");
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
