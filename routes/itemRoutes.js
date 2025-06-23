const express = require("express");
const pool = require("../db");
const { auth } = require("./userRoutes");

const router = express.Router();

// Create Item
router.post("/", auth, async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO items (name, description, price, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read All Items
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items WHERE user_id = $1", [req.user.id]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read Single Item
router.get("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Item
router.put("/:id", auth, async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const result = await pool.query(
      "UPDATE items SET name = $1, description = $2, price = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [name, description, price, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Item
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM items WHERE id = $1 AND user_id = $2 RETURNING *", [
      req.params.id,
      req.user.id,
    ]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item deleted", item: result.rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
