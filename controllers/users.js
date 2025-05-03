const user = require("../models/user");
const User = require("../models/user");
const { use } = require("../routes/clothingItem");
const { STATUS_CODES } = require("../utils/constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

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
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({ name, avatar, email, password: hash });
    })
    .then((user) => {
      res.status(STATUS_CODES.CREATED).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(STATUS_CODES.CONFLICT_ERROR)
          .send({ message: "Email already exists" });
      }
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

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((user) => {
      const { _id, email, avatar, name } = user;
      return res.status(STATUS_CODES.OK).send({ _id, email, avatar, name });
    })
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

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(STATUS_CODES.OK).send({ token });
    })
    .catch((err) => {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    });
};

const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      const { _id, email, avatar, name } = user;
      return res.status(STATUS_CODES.OK).send({ _id, email, avatar, name });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid data" });
      }
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Server Error" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
