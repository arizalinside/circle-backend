const route = require("express").Router();

const user = require("./router/user");

route.use("/user", user);

module.exports = route;
