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

  if (!name || name.length < 2 || name.length > 30) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: "Invalid data provided" });
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

  ClothingItem.findByIdAndDelete(itemId)

    .then((item) => {
      if (!item) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: "item not found" });
      }
      return res.status(STATUS_CODES.OK).json({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: "Item not found" });
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
