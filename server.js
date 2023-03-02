import express from "express";
import fs from "fs";
import path from "path";
import {createServer} from "http";
import {Server} from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let messages = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "database", "chat.json"), "utf-8")
);

app.get("/", (req, res) =>
  res.sendFile(path.join(process.cwd(), "views", "index.html"))
);
app.get("/login", (req, res) => {
  res.sendFile(path.join(process.cwd(), "views", "login.html"));
});

io.on("connection", (socket) => {
  console.log("ulandi");
  socket.on("xabar", (data) => {
    data.id = socket.id;
    data.date = Date(new Date()).split(" ")[4].slice(0, 5);
    messages.push(data);
    fs.writeFileSync(
      path.join(process.cwd(), "database", "chat.json"),
      JSON.stringify(messages, null, 4)
    );
    io.emit("hello", data);
  });
  socket.on("delete", (ids) => {
    messages = messages.filter((m) => m.id != ids.id);
    fs.writeFileSync(
      path.join(process.cwd(), "database", "chat.json"),
      JSON.stringify(messages, null, 4)
    );
    io.emit("datas", messages);
  });
    socket.on("update", (ids2) => {
      messages = messages.filter((m) => m.id != ids2.id);
      fs.writeFileSync(
        path.join(process.cwd(), "database", "chat.json"),
        JSON.stringify(messages, null, 4)
      );
      io.emit("datas", messages);
    });

  socket.on("disconnect", () => {
    console.log("uzildi");
  });
});

httpServer.listen(3000);
console.log("Running ...");