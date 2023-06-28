import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import { getCookie, deleteCookie } from "../Hooks/useCookies";

const Navbar = () => {
  const { user } = useContext(userContext);
  const navigate = useNavigate();

  const handleClick = () => {
    deleteCookie("JWT_AUTH");
    navigate("/login");
  };

  return (
    <nav className="w-full h-16 border border-black bg-black text-white sticky top-0">
      <div className="w-11/12 h-full flex justify-between place-items-center mx-auto">
        <div className="flex gap-x-32">
          <p className="font-semibold text-3xl font-mono py-3">D B C</p>
          <div className="flex place-items-center">
            <ul className="flex gap-x-1 font-semibold font-mono text-md">
              <Link to={"/home"}>
                <li className="px-10 text-center py-3 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                  Home
                </li>
              </Link>
              <Link to={"/contest/all"}>
                <li className="px-10 text-center py-3 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                  View Contests
                </li>
              </Link>
              <Link to={"/challenge/all"}>
                <li className="px-10 text-center py-3 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                  View Challenges
                </li>
              </Link>
              <Link to={"/contest/create"}>
                <li className="px-10 text-center py-3 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                  Create Contest
                </li>
              </Link>
              <Link to={"/challenge/create"}>
                <li className="px-10 text-center py-3 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                  Create Challenge
                </li>
              </Link>
              <Link to={"/codepair"}>
                <li className="px-10 text-center py-3 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                  Code Pair
                </li>
              </Link>
            </ul>
          </div>
        </div>
        {(user.loggedIn == false || getCookie("JWT_AUTH").length == 0) && (
          <div className="flex gap-x-3">
            <Link to={"/login"}>
              <p className="text-lg font-semibold font-mono px-4 py-0.5 bg-green-600 rounded-md hover:scale-[102%] hover:shadow-md hover:shadow-green-600 transition-all duration-300">
                Login
              </p>
            </Link>
            <Link to={"/contact"}>
              <p className="text-lg font-semibold font-mono px-4 py-0.5 bg-white text-black rounded-md hover:scale-[102%] hover:shadow-md hover:shadow-gray-500 transition-all duration-300">
                Contact
              </p>
            </Link>
          </div>
        )}

        {user.loggedIn == true && getCookie("JWT_AUTH").length > 0 && (
          <div className="flex gap-x-3">
            <button onClick={handleClick}>
              <p className="text-lg font-semibold font-mono px-4 py-0.5 bg-green-600 rounded-md hover:scale-[102%] hover:shadow-md hover:shadow-green-600 transition-all duration-300">
                Logout
              </p>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
