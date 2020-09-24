const router = require("express").Router();

const { registerUser, loginUser, getUserById } = require("../controller/user");

router.get("/:id", getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
