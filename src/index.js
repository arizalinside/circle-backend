const route = require("express").Router();

const user = require("./routes/user");
const friend = require("./routes/friend");

route.use("/user", user);
route.use("/friend", friend);

module.exports = route;
