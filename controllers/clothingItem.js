const ClothingItem = require("../models/clothingItem");
const { STATUS_CODES } = require("../utils/constants");

const createItem = (req, res) => {
  console.log("createItem controller hit");
  const { name, weather, imageUrl } = req.body;
  if (!req.user) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: "User authentication required",
    });
  }

  const { _id: userId } = req.user;

  return ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      res.status(STATUS_CODES.CREATED).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(STATUS_CODES.OK).send(items))
    .catch(() => {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)

    .then((item) => {
      if (!item) {
        throw new Error("NotFound");
      }
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new Error("Forbidden");
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((item) => res.status(STATUS_CODES.OK).json({ data: item }))
    .catch((err) => {
      if (err.message === "NotFound") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: "item not found" });
      }
      if (err.message === "Forbidden") {
        return res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: "You don't have permission to delete this item" });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: "Invalid item ID format" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Error from deleteItem" });
    });
};

module.exports = { createItem, getItems, deleteItem };
