const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    weather: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Link is not Valid",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        default: [], // Initialize as an empty array
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("clothingItems", clothingItem);
