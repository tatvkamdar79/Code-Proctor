import axios from "axios";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config/config";
import { userContext } from "../App";
import { getCookie, setCookie } from "../Hooks/useCookies";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform form validation
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    const data = {
      route: "users/login",
      email,
      password,
    };
    try {
      const response = await axios.post(baseURL, data);
      console.log(response.data);
      if (response.data.status === 200) {
        console.log("Success", response.data);
        let jwt = response.data.data.token;
        setCookie("JWT_AUTH", jwt, 5);
        let fetchedUser = await getUserDetails();
        console.log("Fetched User", fetchedUser);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  async function getUserDetails() {
    let jwt = getCookie("JWT_AUTH");
    
    if (jwt.length === 0) {
      return;
    }

    const data = {
      route: "users/getUserDetails",
      authToken: jwt,
    };

    const response = await axios.post(baseURL, data);
    console.log(response.data);
    let fetchedUser = response.data.data.data;
    fetchedUser.loggedIn = true;
    setUser(fetchedUser);
    return fetchedUser;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-1/3 bg-white p-8 rounded shadow-md">
        <h2 className="text-4xl mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
