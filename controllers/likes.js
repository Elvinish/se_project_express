const ClothingItem = require("../models/clothingItem");
const { STATUS_CODES } = require("../utils/constants");

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: {
        likes: req.user._id,
      },
    },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res.status(STATUS_CODES.OK).send({ data: item });
    })
    .catch((err) => {
      console.error("Error liking item:", err);
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res.status(STATUS_CODES.OK).send({ data: item });
    })
    .catch((err) => {
      console.error("Error disliking item", err);
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "invalid Item ID format" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "internal server error" });
    });
};

module.exports = { likeItem, dislikeItem };
