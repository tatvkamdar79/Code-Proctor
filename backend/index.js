const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const exec = require("child_process").exec;
const axios = require("axios");

const url = 'mongodb+srv://aman:aman123@cluster0.nwokpx1.mongodb.net/?retryWrites=true&w=majority';

const connectToDatabase = async () => {
    try {
        const db = await mongoose.connect(url);
        console.log('Successfully connected to database');
        return db;
    } catch (err) {
        console.log('error connecting to db', err);
    }
};

const disconnectDatabase = async () => {
    mongoose.connection.close();
};

connectToDatabase();

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
  socket.on("joinroom", (roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("userjoined");
  });
  socket.on("leaveroom", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("updateBody", ({ value, roomId }) => {
    socket.broadcast.to(roomId).emit("updateBody", value);
    console.log("Updating");
  });
  socket.on("updateInput", ({ value, roomId }) => {
    socket.broadcast.to(roomId).emit("updateInput", value);
  });

  socket.on("setBody", ({ value, roomId }) => {
    socket.broadcast.to(roomId).emit("setBody", value);
  });
  socket.on("setInput", ({ value, roomId }) => {
    socket.broadcast.to(roomId).emit("setInput", value);
  });
  socket.on("setLanguage", ({ value, roomId }) => {
    socket.broadcast.to(roomId).emit("setLanguage", value);
  });
  socket.on("setOutput", ({ value, roomId }) => {
    socket.broadcast.to(roomId).emit("setOutput", value);
  });

  socket.on("joinAudioRoom", (roomId, userId) => {
    socket.broadcast.to(roomId).emit("userJoinedAudio", userId);

    socket.on("leaveAudioRoom", () => {
      socket.broadcast.to(roomId).emit("userLeftAudio", userId);
    });
  });
});

server.listen(9000, () => {
  console.log("SERVER IS RUNNING");
});

// Routes
app.use('/api/room', require('./routes/room.routes'));

app.get("/", async (req, res) => {
  // console.log(req.body);
  // const url = req.query.route;
  // try {
  //   const response = await axios.get(`http://localhost/index.php/${url}`);
  // } catch (err) {
  //   console.log("Error occurred: ");
  // }
  console.log("Hello");
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
    console.log(err);
    console.log("Error occurred: ");
    return res.status(400).json({ message: "Error occurred" });
  }
});

app.listen(8080, () => {
  console.log("Server Started");
});
