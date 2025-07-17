const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { STATUS_CODES } = require("../utils/constants");
const { BadRequestError, NotFoundError } = require("../utils/errors");

const likeItem = (req, res, next) => {
  const { _id: userId } = req.user;

  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    { new: true }
  )
    .orFail(() => {
      throw Object.assign(new Error("Item not found"), {
        statusCode: STATUS_CODES.NOT_FOUND,
      });
    })
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      return res.status(STATUS_CODES.OK).send({ data: item });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { _id: userId } = req.user;

  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      return res.status(STATUS_CODES.OK).send({ data: item });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

module.exports = { likeItem, dislikeItem };
