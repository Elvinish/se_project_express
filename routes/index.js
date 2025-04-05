const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const likeRouter = require("./likes");

router.use("/items", clothingItem);
router.use("/users", userRouter);
router.use("/items", likeRouter);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;
