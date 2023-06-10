import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const JoinRoom = (props) => {
  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = () => {
    if (roomId) {
      props.history.push(`/room/${roomId}`);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center pt-5 mt-5">
        <div className="w-64">
          <h1 className="text-3xl font-bold">Enter Room ID</h1>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
            placeholder="Enter room id"
          />
          <small className="text-gray-500">
            Please enter the link provided to you
            <br />
            <Link to="/newroom">Make your own room</Link>
          </small>
        </div>
        <button
          onClick={handleJoinRoom}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-3"
        >
          <h3 className="text-lg">Join Room</h3>
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
