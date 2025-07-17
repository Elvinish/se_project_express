const router = require("express").Router({ mergeParams: true });
const { likeItem, dislikeItem } = require("../controllers/likes");
const { validateItemId } = require("../middlewares/validation");

router.put("/", validateItemId, likeItem);

router.delete("/", validateItemId, dislikeItem);

module.exports = router;
