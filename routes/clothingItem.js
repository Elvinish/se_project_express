const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItem");

// CRUD

// Create

router.post("/", auth, createItem);

// Read

router.get("/", getItems);

// Delete

router.delete("/:itemId", auth, deleteItem);

module.exports = router;
