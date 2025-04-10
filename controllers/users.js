const User = require("../models/user");
const { STATUS_CODES } = require("../utils/constants");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_CODES.OK).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(STATUS_CODES.CREATED).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid data" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "Not found error" });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid data" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUser };
