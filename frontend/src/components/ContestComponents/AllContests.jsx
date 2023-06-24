import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../config/config";
// import ongoingContestLoading from "../../assets/ongoingContestsLoading.gif";
import { BiSearchAlt } from "react-icons/bi";
import { getCookie } from "../../Hooks/useCookies";

const AllContestsComponent = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("allContests");
  const navigate = useNavigate();

  useEffect(() => {
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    let time = new Date(Date.now()).toLocaleDateString().split("/");
    const formattedTime =
      `${time[2]}-${time[1]}-${time[0]}` +
      "T" +
      new Date().toLocaleTimeString() +
      ".000Z";
    console.log(formattedTime);
    const data = {
      route: "contests/getContestSummary",
      authToken: jwt,
      time: formattedTime,
    };

    axios
      .post(baseURL, data)
      .then((response) => {
        setContests(response.data.data);
        setFilteredContests(response.data.data.allContests);
      })
      .catch((err) => console.log(err));
  }, []);

  // const filteredContests = contests.filter((contest) =>
  //   contest.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleSearchChange = (event) => {
    const allContests = contests["allContests"];
    const newFilteredContests = allContests.filter((contest) =>
      contest.contestName.toLowerCase().includes(event.target.value)
    );
    console.log(newFilteredContests);
    setFilteredContests(newFilteredContests);
    // setFilteredContests(newFilteredContests);
    setSearchQuery(event.target.value);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    console.log(filteredContests);
  }, [filteredContests]);

  return (
    <div
      className={`w-full h-[94vh] mx-auto p-4 transition-all duration-1000 ${
        filteredContests ? "bg-stone-100" : "bg-white"
      }`}
    >
      <div className="w-full mb-4 flex justify-center place-items-center">
        <BiSearchAlt size={40} className="w-1/12" />
        <input
          type="text"
          placeholder="Search contest name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-11/12 p-4 border-2 border-gray-300 rounded-lg mx-auto outline-none transition-all duration-300 focus:border-green-500 hover:border-green-600"
        />
      </div>
      <div className="flex w-full gap-x-5">
        <div className="w-4/5">
          {!filteredContests && (
            <div className="absolute flex top-[17%] w-[97%]">
              <img
                src={
                  "https://i.pinimg.com/originals/3a/81/05/3a8105197bf6472fa8e825c06a3e5041.gif"
                }
                alt=""
                className="w-[20%]"
              />
              <img
                src={
                  "https://i.pinimg.com/originals/3a/81/05/3a8105197bf6472fa8e825c06a3e5041.gif"
                }
                alt=""
                className="w-[20%]"
              />
              <img
                src={
                  "https://i.pinimg.com/originals/3a/81/05/3a8105197bf6472fa8e825c06a3e5041.gif"
                }
                alt=""
                className="w-[20%]"
              />
              <img
                src={
                  "https://i.pinimg.com/originals/3a/81/05/3a8105197bf6472fa8e825c06a3e5041.gif"
                }
                alt=""
                className="w-[20%]"
              />
            </div>
          )}
          <div className="h-[78vh] overflow-y-scroll p-2">
            <table className="w-full">
              <thead>
                <tr className="bg-cyan-700 text-white">
                  <th className="p-4 border border-gray-400">Contest Number</th>
                  <th className="p-4 border border-gray-400">Contest Name</th>
                  <th className="p-4 border border-gray-400">
                    No. of Contestants
                  </th>
                  <th className="p-4 border border-gray-400">
                    No. of Questions
                  </th>
                  <th className="p-4 border border-gray-400">Start Date</th>
                  <th className="p-4 border border-gray-400">End Date</th>
                  <th className="p-4 border border-gray-400">Manage</th>
                </tr>
              </thead>
              <tbody>
                {filteredContests &&
                  filteredContests.map((contest, idx) => (
                    <tr
                      key={idx}
                      className="border-b cursor-pointer hover:bg-green-100 transition-all duration-300 bg-green-50"
                      onClick={() =>
                        navigate(`/contest/manage/${contest.contestName}`)
                      }
                    >
                      <td className="p-4 text-center font-semibold font-mono border border-green-700">
                        {idx + 1}
                      </td>
                      <td className="p-4 text-center font-semibold font-mono border border-green-700">
                        {contest.contestName}
                      </td>
                      <td className="p-4 text-center font-semibold font-mono border border-green-700">
                        {contest.contestants.length}
                      </td>
                      <td className="p-4 text-center font-semibold font-mono border border-green-700">
                        {contest.questions.length}
                      </td>
                      <td className="p-4 text-center font-semibold font-mono border border-green-700">
                        {formatDate(contest.contestStartDate.sec * 1000)}
                      </td>
                      <td className="p-4 text-center font-semibold font-mono border border-green-700">
                        {formatDate(contest.contestEndDate.sec * 1000)}
                      </td>
                      <td className="p-4 text-center font-semibold font-mono border border-green-700">
                        <p className="text-white font-semibold font-mono px-8 py-2 bg-cyan-500 rounded-md tracking-wider">
                          Manage
                        </p>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-lg font-semibold font-mono mx-auto text-center">
            {filteredContests
              ? "Tip: Click on a contest for details"
              : "Hold on! We're fetching data from our servers..."}
          </p>
        </div>
        <div className="w-1/5 bg-gray-100 h-[88vh] p-5 border-2 border-gray-400">
          <p className="font-semibold font-mono text-2xl text-gray-800">
            Filter Contests
          </p>
          <div className="h-1 w-full bg-gray-300 mb-4" />
          <ul className="flex flex-col gap-3 font-mono font-semibold text-xl text-white">
            <li>
              <button
                onClick={() => {
                  setFilteredContests(contests?.allContests);
                  console.log(contests?.allContests);
                  setFilter("allContests");
                }}
                className={`px-4 py-2 transition-all duration-300 rounded-md ${
                  filter === "allContests"
                    ? "bg-gray-400"
                    : "bg-green-500 hover:bg-green-600 shadow-md shadow-gray-700"
                }`}
              >
                All Contests
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setFilteredContests(contests?.ongoingContests);
                  setFilter("ongoingContests");
                }}
                className={`px-4 py-2 transition-all duration-300 rounded-md ${
                  filter === "ongoingContests"
                    ? "bg-gray-400"
                    : "bg-green-500 hover:bg-green-600 shadow-md shadow-gray-700"
                }`}
              >
                Ongoing Contests
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setFilteredContests(contests?.upcomingContests);
                  setFilter("upcomingContests");
                }}
                className={`px-4 py-2 transition-all duration-300 rounded-md ${
                  filter === "upcomingContests"
                    ? "bg-gray-400"
                    : "bg-green-500 hover:bg-green-600 shadow-md shadow-gray-700"
                }`}
              >
                Upcoming Contests
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setFilteredContests(contests?.pastContests);
                  setFilter("pastContests");
                }}
                className={`px-4 py-2 transition-all duration-300 rounded-md ${
                  filter === "pastContests"
                    ? "bg-gray-400"
                    : "bg-green-500 hover:bg-green-600 shadow-md shadow-gray-700"
                }`}
              >
                Past Contests
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AllContestsComponent;
