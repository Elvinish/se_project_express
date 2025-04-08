const router = require("express").Router({ mergeParams: true });
const { likeItem, dislikeItem } = require("../controllers/likes");

router.put("/", likeItem);

router.delete("/", dislikeItem);

module.exports = router;
