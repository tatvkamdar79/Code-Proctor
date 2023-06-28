import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../config/config";
import API from "../utils/API";

const EditRoom = (props) => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [interviewerEmail, setInterviewerEmail] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [intervieweeEmail, setIntervieweeEmail] = useState("");
  const [interviewee, setInterviewee] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [showStartTime, setShowStartTime] = useState(false);

  const possibleTimes = [
    "00:00",
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    "06:00",
    "06:15",
    "06:30",
    "06:45",
    "07:00",
    "07:15",
    "07:30",
    "07:45",
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
    "20:15",
    "20:30",
    "20:45",
    "21:00",
    "21:15",
    "21:30",
    "21:45",
    "22:00",
    "22:15",
    "22:30",
    "22:45",
    "23:00",
    "23:15",
    "23:30",
    "23:45",
  ];

  const handleSubmit = () => {
    if (
      roomName.length == 0 ||
      interviewerEmail.length == 0 ||
      interviewer.length == 0 ||
      intervieweeEmail.length == 0 ||
      interviewee.length == 0 ||
      interviewDate.length == 0 ||
      startTime.length == 0
    ) {
      alert("All fields are mandatory");
      return;
    }
    const data = {
      route: "room/createRoom",
      title: roomName,
      interviewerEmail,
      interviewer,
      intervieweeEmail,
      interviewee,
      interviewDate: String(interviewDate) + "T" + startTime + ":" + "00",
    };
    axios
      .post(baseURL, data)
      .then((res) => {
        console.log(res.data);
        navigate(`/room/${res.data.data.id.$oid}`);
      })
      .catch((err) => {
        console.log(err);
        alert("Looks like some error occured");
      });
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center pt-5 mt-5">
        <div className="w-64 flex flex-col justify-center place-items-center">
          <h1 className="text-3xl font-bold mb-4">Create New Room</h1>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
            placeholder="Enter room name"
          />

          <div className="py-2 w-fit">
            <label className="flex place-items-center gap-x-7">
              <p className="w-60 font-medium text-gray-600">
                Interviewer Name: <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                required
                className="w-60 px-4 py-2 border rounded-md"
              />
            </label>
          </div>

          <div className="py-2 w-fit">
            <label className="flex place-items-center gap-x-7">
              <p className="w-60 font-medium text-gray-600">
                Interviewer Email: <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                value={interviewerEmail}
                onChange={(e) => setInterviewerEmail(e.target.value)}
                required
                className="w-60 px-4 py-2 border rounded-md"
              />
            </label>
          </div>

          <div className="py-2 w-fit">
            <label className="flex place-items-center gap-x-7">
              <p className="w-60 font-medium text-gray-600">
                Interviewee Name: <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                value={interviewee}
                onChange={(e) => setInterviewee(e.target.value)}
                required
                className="w-60 px-4 py-2 border rounded-md"
              />
            </label>
          </div>

          <div className="py-2 w-fit">
            <label className="flex place-items-center gap-x-7">
              <p className="w-60 font-medium text-gray-600">
                Interviewee Email: <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                value={intervieweeEmail}
                onChange={(e) => setIntervieweeEmail(e.target.value)}
                required
                className="w-60 px-4 py-2 border rounded-md"
              />
            </label>
          </div>

          <div className="py-2 w-fit">
            <label className="flex place-items-center gap-x-7">
              <p className="w-60 font-medium text-gray-600">
                Interview Date<span className="text-red-500">*</span>
              </p>
              <input
                type="date"
                name=""
                id=""
                className="border border-gray-300 pl-3"
                onChange={(e) => setInterviewDate(e.target.value)}
                required
              />
            </label>
          </div>
          {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
          <div className="py-2 w-fit">
            <label className="flex gap-x-7">
              <p className="w-60 mt-3 font-medium text-gray-600">
                Interview Time (IST, 24 hour time):{" "}
                <span className="text-red-500">*</span>
              </p>
              <div>
                <input
                  type="text"
                  value={startTime}
                  readOnly
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-60 px-4 py-2 border rounded-md"
                  onFocus={() => setShowStartTime(true)}
                  onBlur={() => setTimeout(() => setShowStartTime(false), 200)}
                />
                <ul
                  className={`${
                    !showStartTime && "hidden"
                  } absolute bg-white w-60 border px-2 flex flex-col gap-y-1 h-40 overflow-y-scroll`}
                >
                  {possibleTimes.map((time) => (
                    <li onClick={(e) => setStartTime(e.target.innerText)}>
                      {time}
                    </li>
                  ))}
                </ul>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-3"
        >
          <h3 className="text-lg">Create Room</h3>
        </button>
      </div>
    </div>
  );
};

export default EditRoom;
