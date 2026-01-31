import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();
// MongoDB connection URI
const mongoUri = process.env.MONGO_URL;
const dbName = "products-db";

// Chatbot endpoint
router.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) return res.status(400).json({ message: "Question required" });

  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db(dbName);

    const products = await db.collection("products").find({}).toArray();

    let answer = "";

    const q = question.toLowerCase();

    if (q.includes("products") || q.includes("available")) {
      answer =
        "Available products:\n" +
        products.map((p) => `• ${p.productName} (Qty: ${p.quantity})`).join("\n");
    } else if (q.includes("low stock")) {
      const lowStock = products.filter((p) => p.quantity < 10);
      answer =
        lowStock.length > 0
          ? "Low stock products:\n" +
            lowStock.map((p) => `• ${p.productName} (Qty: ${p.quantity})`).join("\n")
          : "No products are low in stock.";
    } else if (q.includes("total revenue")) {
      const revenue = products.reduce(
        (acc, p) => acc + Number(p.price) * Number(p.quantity),
        0
      );
      answer = `Total revenue from all products: $${revenue}`;
    } else {
      answer = "Sorry, I can only answer product-related questions for this demo.";
    }

    res.json({ answer });
  } catch (err) {
    console.log("Chatbot error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
});

export default router;
