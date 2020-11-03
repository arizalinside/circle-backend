const router = require("express").Router();

const {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  patchUserById,
} = require("../controller/user");
const { authorization } = require("../middleware/auth");
const upload = require("../middleware/multer");

router.get("/", authorization, getAllUser);
router.get("/:id", authorization, getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/:id", authorization, upload, patchUserById);

module.exports = router;
