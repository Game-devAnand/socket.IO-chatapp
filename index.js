const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { callbackify } = require("util");

const app = express();
const server = http.createServer(app);

app.use(express.static(path.resolve("./public")));

const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
});

app.get("/chat", (req, res) => {
  res.sendFile("./public/chat.html");
});

let user = {};

io.on("connection", (socket) => {
  socket.on("login", (username) => {
    user[username] = socket.id;
    console.log(username + "logged in");
  });

  socket.on("sendMessage", (data) => {
    const { sender, receiver, message } = data;

    if (user[receiver]) {
      if (user[receiver] === user[sender]) {
        socket.emit("error", "you cant send message to yourself");
      } else {
        io.to(user[receiver]).emit("receiveMessage", { sender, message });
      }
    } else {
      socket.emit("error", "User not online");
    }
  });

  socket.on("disconnect", () => {
    for (let username in user) {
      if (user[username] === socket.id) {
        delete user[username];
        console.log(username + " disconnected");
        break;
      }
    }
  });
});

server.listen(9000, () => {
  console.log(`server run on port 9000`);
});
