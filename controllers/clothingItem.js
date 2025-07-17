const ClothingItem = require("../models/clothingItem");
const { STATUS_CODES } = require("../utils/constants");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  if (!req.user) {
    return next(new BadRequestError("User authentication required"));
  }

  const { _id: userId } = req.user;

  return ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      res.status(STATUS_CODES.CREATED).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(STATUS_CODES.OK).send(items))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)

    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(
          "You don't have permission to delete this item"
        );
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((item) => res.status(STATUS_CODES.OK).json({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

module.exports = { createItem, getItems, deleteItem };
