const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const routerNavigation = require("./src");
const socket = require("socket.io");
const app = express();

const http = require("http");
const server = http.createServer(app);
const io = socket(server);

io.on("connection", (socket) => {
  console.log("Socket.io connect!");

  socket.on("start", (data) => {
    socket.join(data.user_id);
  });

  socket.on("selectRoom", (data) => {
    socket.join(data.roomchat_id);
  });

  socket.on("changeRoom", async (data) => {
    await socket.leave(data.oldRoom);
    socket.join(data.newRoom);
  });

  socket.on("roomMessage", (data) => {
    io.to(data.roomchat_id).emit("chatMessage", data);
  });

  socket.on("notif", (data) => {
    socket.broadcast.to(data.getter_id).emit("notifMessage", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.to(data.room_id).emit("typingMessage", data.user_name);
  });
});

app.use(cors());
app.use(express.static("uploads"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-request-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/", routerNavigation);

app.get("*", (request, respond) => {
  respond.status(404).send("Path Not Found !");
});

server.listen(3000, () => {
  console.log("Listening on Port 3000");
});
