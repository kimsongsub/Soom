import http from "http";
import express from "express";
// import WebSocket from "ws";
import { Server } from "socket.io";

// express가 하는 일은 (1)views를 설정해주고 (2)render해주고 (3)Listen해주는 것이 전부
// 나머지 기능은 websocket에서 실시간으로 관리
const app = express();
//(1)
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
//(2)
app.get("/", (req, res) => res.render("home.pug"));
//(2-1) 만드려는 페이지는 싱글페이지여서 static으로 허용된 주소(public)이외에 다른 명령어(주소)를 입력하면 home위치로 redirect 시킴
app.get("/*", (req, res) => res.redirect("/"));
//(3)
const handleListen = () =>
  console.log("server opened !!\n[Listening on http://localhost:3000]");
// app.listen(3000);
// --------------------------------------------------------------------------------------------------------------
// 두 종류의 프로토콜을 한번에 적용 (두개가 같은 포트에)
// make http server
const httpServer = http.createServer(app);
//make socketServer from socket.io
const socketIOServer = new Server(httpServer);

httpServer.listen(3000, handleListen);

socketIOServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    startMedia();

    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
});
