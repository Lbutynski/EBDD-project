import express from "express";
import cors from "cors";
import "dotenv/config";
import clientRouteur from "./routes/client.mjs";
import produitRouteur from "./routes/produits.mjs";
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/client", clientRouteur);
app.use("/api/produit", produitRouteur);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
