const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const likeRouter = require("./likes");

router.use("/users", userRouter);
router.use("/items/:itemId/likes", likeRouter);
router.use("/items", clothingItem);

// router.use("/", likeRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
