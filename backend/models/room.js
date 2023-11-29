const mongoose = require("mongoose");
const { Schema } = mongoose;

const roomSchema = new Schema({
  title: String,
  body: String,
  input: String,
  language: String,
  interviewerEmail: String,
  interviewer: String,
  intervieweeEmail: String,
  interviewee: String,
  interviewDate: Date,
});

const room = mongoose.model("room", roomSchema);

module.exports = room;