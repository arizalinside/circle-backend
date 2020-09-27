const router = require("express").Router();
const { addFriend } = require("../controller/friend");
const { authorization } = require("../middleware/auth");

router.post("/add-friend", authorization, addFriend);

module.exports = router;
