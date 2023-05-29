import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/API";

const NewRoom = (props) => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");

  const handleSubmit = () => {
    API.post("/api/room", { title: roomName })
      .then((res) => {
        navigate(`/room/${res.data.data}`);
      })
      .catch((err) => {
        alert("Looks like some error occured");
      });
  };

  return (
    <div className="container-fluid">
      <div>
        <div className="form-group text-center pt-5 mt-5 row justify-content-center">
          <div className="col-5">
            <h1>Create New Room</h1>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="form-control"
              placeholder="Enter room name"
            />
            <small id="emailHelp" className="form-text text-muted">
              Create your room or <Link to="/joinroom"> Join another </Link>
            </small>
          </div>
        </div>
        <div className="form-group text-center pt-3 row justify-content-center">
          <button
            onClick={handleSubmit}
            className="btn btn-primary col-2 text-lg"
          >
            <h3>Join Room</h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
