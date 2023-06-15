import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function CodePairHome(previousRooms) {
  //   const previousRooms = []; // Assuming previousRooms is an array

  useEffect(() => {
    console.log("Hello");
  });

  return (
    <div className="p-5 text-center">
      <div>
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
      {previousRooms.length > 0 ? (
        <div>
          <hr />
          <br />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default CodePairHome;
