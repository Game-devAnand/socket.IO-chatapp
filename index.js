const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(express.static(path.resolve("./public")));
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
});

io.on("connection", (socket) => {
  socket.on("user-message", (msg) => {
    io.emit("s-msg", msg);
  });
});

server.listen(9000, () => {
  console.log(`server run on port 9000`);
});
