const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateItemId,
  validateCardBody,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItem");

// CRUD

// Create

router.post("/", auth, validateCardBody, createItem);

// Read

router.get("/", getItems);

// Delete

router.delete("/:itemId", auth, validateItemId, deleteItem);

module.exports = router;
