const router = require("express").Router();
const {
  createRoom,
  postMessage,
  getRoomByUser,
  getRoomByid,
} = require("../controller/chat");
const { authorization } = require("../middleware/auth");

router.get("/room/:id", authorization, getRoomByUser);
router.get("/room/:sender_id/:roomchat_id", authorization, getRoomByid);

router.post("/create", authorization, createRoom);
router.post("/send-message", authorization, postMessage);

module.exports = router;
