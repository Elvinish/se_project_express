const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const likeRouter = require("./likes");

const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateSignupBody,
  validateLoginBody,
} = require("../middlewares/validation");
const NotFoundError = require("../utils/errors/NotFoundError");

router.post("/signin", validateLoginBody, login);
router.post("/signup", validateSignupBody, createUser);

router.use("/items", clothingItem);
router.use("/users", userRouter);
router.use("/items/:itemId/likes", auth, likeRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
