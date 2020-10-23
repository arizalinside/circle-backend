const router = require("express").Router();

const {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
} = require("../controller/user");
const { authorization } = require("../middleware/auth");

router.get("/", authorization, getAllUser);
router.get("/:id", authorization, getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
