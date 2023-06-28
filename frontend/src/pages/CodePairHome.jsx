import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../config/config";
import { getCookie } from "../Hooks/useCookies";
import { FaUser, FaUserTie } from "react-icons/fa";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

const CodePairHome = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selection, setSelection] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomIdx, setRoomIdx] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getAllRooms = async () => {
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    try {
      console.log("Getting All Rooms");
      const response = await axios.post(baseURL, {
        authToken: jwt,
        route: "room/getAllRooms",
      });
      console.log(response);
      for (let room of response.data.data) {
        console.log(room);
      }
      setRooms(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllRooms();
  }, []);

  const sendInvites = async () => {
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    let roomsToSendInvite = selection.map((idx) => rooms[idx]._id.$oid);
    console.log(roomsToSendInvite);

    const data = {
      authToken: jwt,
      route: "room/sendInvitations",
      rooms: roomsToSendInvite,
    };
    try {
      const response = await axios.post(baseURL, data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full p-5">
      <div className="text-center">
        <h1 className="mb-3">Discode</h1>
        <h4 className="mb-3">Code collaboration with voice rooms</h4>
        <small className="mb-3">
          Now you don't need to be on discord and screen share anymore fellow
          coders :p
        </small>
        <br />
        <br />
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2"
          to="/newroom"
        >
          Create a room
        </Link>
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2"
          to="/joinroom"
        >
          Join an existing room
        </Link>
      </div>
      <br />
      <div className="w-full border p-3">
        <div className="w-full flex justify-between place-items-center">
          <p className="text-2xl font-semibold font-mono text-gray-700 mb-4">
            Your Rooms
          </p>
          <div className="flex gap-x-3 font-semibold font-mono">
            <button
              className={`text-sm text-center px-3 py-0.5 bg-green-600 text-white rounded-full ${
                selection && selection.length === rooms.length && "opacity-50"
              }`}
              disabled={selection && selection.length === rooms.length}
              onClick={() => {
                let newSelection = [];
                for (let i = 0; i < rooms.length; i++) {
                  newSelection.push(i);
                }
                setSelection(newSelection);
              }}
            >
              Select All
            </button>
            {selection && selection.length === rooms.length && (
              <button
                className={`text-sm text-center px-3 py-0.5 bg-gray-600 text-white rounded-full`}
                onClick={() => setSelection([])}
              >
                Unselect All
              </button>
            )}
            <button
              className="text-sm text-center px-3 py-0.5 bg-cyan-600 text-white rounded-full"
              onClick={sendInvites}
            >
              Send Invites
            </button>
          </div>
        </div>
        <div className="grid grid-cols-5 place-items-center gap-5">
          {rooms &&
            rooms.map((room, index) => (
              <div
                key={index}
                className={`w-full h-44 flex flex-col rounded-lg hover:scale-[98.5%] transition-all duration-300 gap-y-1 shadow-gray-400 py-1 ${
                  selection.includes(index)
                    ? "bg-green-100 shadow-sm scale-[98.5%] border border-green-600"
                    : "bg-gray-100 shadow-md border border-gray-400"
                }`}
                onClick={() => {
                  if (selection.includes(index)) {
                    let newSelection = [...selection];
                    newSelection.splice(newSelection.indexOf(index), 1);
                    setSelection(newSelection);
                  } else {
                    setSelection((selection) => [...selection, index]);
                  }
                }}
              >
                <div className="flex justify-between px-2">
                  <p className="text-xl text-cyan-700 font-semibold font-mono w-2/3">
                    {room.title}
                  </p>
                  <p className="text-sm text-gray-600 font-semibold font-mono w-1/3 text-end">
                    {room.interviewDate != null &&
                    room?.interviewDate?.length != 0
                      ? `${new Date(room?.interviewDate?.sec * 1000)
                          .toLocaleString()
                          .slice(0, 10)}, 
                          ${new Date(room?.interviewDate?.sec * 1000)
                            .toUTCString()
                            .slice(17, 22)}`
                      : "Not yet Scheduled"}
                  </p>
                </div>

                <hr className="bg-gray-300 h-0.5" />

                <div className="h-20 flex justify-between place-items-center text-gray-600 font-semibold font-serif p-1 px-2">
                  <div className="flex flex-col justify-center place-items-center w-1/2 border-r border-gray-400">
                    <FaUserTie size={27} className="inline text-cyan-700" />
                    <p className="">{room.interviewee}</p>
                  </div>
                  <hr className="bg-gray-300 h-0.5" />
                  <div className="flex flex-col justify-center place-items-center w-1/2 border-l border-gray-400 relative">
                    <FaUser size={27} className="inline  text-orange-900" />
                    <span className="">{room.interviewer}</span>
                    <button className="absolute right-1 -top-1.5 text-sm text-center text-white">
                      <HiOutlineClipboardDocumentList
                        size={28}
                        className="text-green-900 hover:scale-110 transition-all"
                      />
                    </button>
                  </div>
                </div>

                <hr className="bg-gray-300 h-0.5" />

                <div className="w-full h-11 flex justify-evenly place-items-center px-2 font-semibold">
                  <button className="text-sm text-center px-3 py-0.5 bg-cyan-600 text-white rounded-full">
                    Send Invites
                  </button>
                  {/* <button
                    className="text-sm text-center px-3 py-0.5 bg-cyan-600 text-white rounded-full"
                    onClick={() => {
                      console.log("Setting index", roomIdx);
                      console.log("index is", index);
                      setRoomIdx(index);
                      openModal();
                    }}
                  >
                    Edit Details
                  </button> */}
                  <Link
                    to={`/room/${room._id.$oid}`}
                    className="text-sm text-center px-3 py-0.5 bg-cyan-600 text-white rounded-full "
                  >
                    Go to Room
                  </Link>
                </div>
              </div>
            ))}
        </div>
        {rooms.length > 0 && (
          <div className="h-96">
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              roomIdx={roomIdx}
              rooms={rooms}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, roomIdx, rooms }) => {
  console.log(roomIdx);
  console.log(rooms[roomIdx]);
  const x = roomIdx;
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [roomName, setRoomName] = useState(rooms[roomIdx].title);
  const [interviewerEmail, setInterviewerEmail] = useState(
    rooms[roomIdx].interviewerEmail
  );
  const [interviewer, setInterviewer] = useState(rooms[roomIdx].interviewer);
  const [intervieweeEmail, setIntervieweeEmail] = useState(
    rooms[roomIdx].intervieweeEmail
  );
  const [interviewee, setInterviewee] = useState(rooms[roomIdx].interviewee);
  const [interviewDate, setInterviewDate] = useState(
    rooms[roomIdx].interviewDate
  );
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

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 h-full">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded">
            {/* Modal content */}

            <p
              className={`text-sm ${
                !isError ? "text-green-700" : "text-red-700"
              } items-center mb-3`}
            >
              {message}
            </p>
            <h1 className="text-3xl font-bold mb-4">Modify Room</h1>
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
                    onBlur={() =>
                      setTimeout(() => setShowStartTime(false), 200)
                    }
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
            <div className="flex flex-col">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                // onClick={}
              >
                Save Changes
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePairHome;
