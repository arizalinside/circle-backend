const router = require("express").Router();

const { registerUser, loginUser, getUserById } = require("../controller/user");
const { authorization } = require("../middleware/auth");

router.get("/:id", authorization, getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
