const router = require("express").Router();
const {
  addFriend,
  getFriendByUser,
  deleteFriend,
} = require("../controller/friend");
const { authorization } = require("../middleware/auth");

router.get("/:id", authorization, getFriendByUser);
router.post("/add-friend", authorization, addFriend);
router.delete("/delete", authorization, deleteFriend);

module.exports = router;
