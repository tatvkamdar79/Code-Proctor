import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import History from "../components/history";

// interface HomeProps {
//     previousRooms: string[];
// }

const Home = ({ previousRooms }) => {
  return (
    <div className="p-5 text-center">
      <div>
        <h1 className="mb-3">Darwinbox Code Pair</h1>
        <h4 className="mb-3">Testing your coding skills.</h4>
        <small className="mb-3">
          Darwinbox Code Pair is a platform that allows us assess your coding
          skills.
        </small>
        <br />
        <br />
        <Link className="btn btn-primary p-2 m-2" to="/newroom">
          Create a room
        </Link>
        <Link className="btn btn-primary p-2 m-2" to="/joinroom">
          Join an existing room
        </Link>
      </div>
      <br />
      {previousRooms !== undefined && previousRooms.length > 0 ? (
        <div>
          <hr />
          <br />
          <h3>Your history</h3>
          <History previousRooms={previousRooms} />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default Home;
