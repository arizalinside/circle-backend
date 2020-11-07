const route = require("express").Router();

const user = require("./routes/user");
const friend = require("./routes/friend");
const chat = require("./routes/chat");

route.use("/user", user);
route.use("/friend", friend);
route.use("/chat", chat);

module.exports = route;
