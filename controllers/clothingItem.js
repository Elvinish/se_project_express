const ClothingItem = require("../models/clothingItem");
const { STATUS_CODES } = require("../utils/constants");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from createItem", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(STATUS_CODES.OK).send(items))
    .catch((err) => {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from getItems", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(STATUS_CODES.OK).send({ data: item }))
    .catch((err) => {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from updateItem", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log("itemId");
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(STATUS_CODES.NO_CONTENT).send({}))
    .catch((err) => {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from deleteItem", err });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
