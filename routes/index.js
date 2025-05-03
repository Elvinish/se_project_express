const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const likeRouter = require("./likes");
const { STATUS_CODES } = require("../utils/constants");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", clothingItem);

router.use("/items", auth, clothingItem);
router.use("/users", userRouter);
router.use("/items/:itemId/likes", auth, likeRouter);

router.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
