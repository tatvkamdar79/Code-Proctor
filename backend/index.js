const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const exec = require("child_process").exec;
const axios = require("axios");

app.use(cors());
app.use(bodyParser());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log(data);
    socket.join(data.room);
  });

  socket.on("writing", (data) => {
    console.log(socket.id, data);
    socket.to(data.room).emit("written", data.code);
  });

  socket.on("change_language", (data) => {
    console.log(socket.id, "changed language to ", data.language);
    socket.to(data.room).emit("changed_language", { language: data.language });
  });

  socket.on("test", (data) => {
    console.log(data);
    socket.emit("a", data);
  });

  socket.on("leave_room", (data) => {
    console.log("user ", socket.id, " is Leaving room ", data);
    socket.leave(data.room);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("typed", data.text);
  });

  socket.on("resize", (data) => {
    if (data.room === "") {
      return;
    }
    console.log(data);
    socket.to(data.room).emit("resized", data);
  });

  socket.on("leave_room", (data) => {
    socket.leave(data.room);
  });
});

// server.listen(9000, () => {
//   console.log("SERVER IS RUNNING");
// });

// app.get("/", (req, res) => {
//   res.send("ljkjdflksjfds");
// });

// app.post("/api/submit", (req, res) => {
//   console.log(req.body);
//   fs.writeFile("test.py", req.body.code, (err) => {
//     if (err) throw err;
//     else {
//       console.log("The file is updated with the given data");
//     }
//   });

//   exec("python3 test.py", (err, stdout, stderr) => {
//     if (err) {
//       console.log(err);
//       res.json(stderr);
//     } else {
//       console.log(stderr);
//       res.json({ output: stdout });
//     }
//   });
// });

app.get("/", async (req, res) => {
  console.log(req.body);
  const url = req.query.route;
  try {
    const response = await axios.get(`http://localhost/index.php/${url}`);
  } catch (err) {
    console.log("Error occurred: ");
  }
});

app.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const url = req.body.route;
    const response = await axios.post(
      `http://demo.darwinboxlocal.com/index.php/${url}`,
      req.body
    );
    // console.log(response.data.data.groups[0]._id["$oid"]);
    return res.status(200).json(response.data);
  } catch (err) {
    console.log("Error occurred: ", err);
    return res.status(400).json({ message: "Error occurred" });
  }
});

app.listen(8080, () => {
  console.log("Server Started");
});
