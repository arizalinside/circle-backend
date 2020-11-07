const router = require("express").Router();

const {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  patchUserById,
  patchStatus,
  getUserStatus,
  patchLocation,
} = require("../controller/user");
const { authorization } = require("../middleware/auth");
const upload = require("../middleware/multer");

router.get("/", authorization, getAllUser);
router.get("/:id", authorization, getUserById);
router.get("/status/:id", authorization, getUserStatus);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/update/:id", authorization, upload, patchUserById);
router.patch("/update-status/:id", authorization, patchStatus);
router.patch("/update-location/:id", authorization, patchLocation);

module.exports = router;
