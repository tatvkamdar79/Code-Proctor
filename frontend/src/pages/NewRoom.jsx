import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../config/config";
import API from "../utils/API";

const NewRoom = (props) => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");

  const handleSubmit = () => {
    const data = {
      route: "room/createRoom",
      title: roomName,
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
          <small className="text-gray-600">
            Create your room or <a href="/joinroom">Join another</a>
          </small>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-3"
        >
          <h3 className="text-lg">Join Room</h3>
        </button>
      </div>
    </div>
  );
};

export default NewRoom;
