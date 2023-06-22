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
                    {room?.scheduledTime || "Not Scheduled"}
                  </p>
                </div>

                <hr className="bg-gray-300 h-0.5" />

                <div className="h-20 flex justify-between place-items-center text-gray-600 font-semibold font-serif p-1 px-2">
                  <div className="flex flex-col justify-center place-items-center w-1/2 border-r border-gray-400">
                    <FaUserTie size={27} className="inline text-cyan-700" />
                    <p className="">Tatva Kamdar</p>
                  </div>
                  <hr className="bg-gray-300 h-0.5" />
                  <div className="flex flex-col justify-center place-items-center w-1/2 border-l border-gray-400 relative">
                    <FaUser size={27} className="inline  text-orange-900" />
                    <span className="">Tatva Kamdar</span>
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
      </div>
    </div>
  );
};

export default CodePairHome;
