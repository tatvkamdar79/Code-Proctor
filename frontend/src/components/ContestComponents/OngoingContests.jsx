import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../config/config";
import ongoingContestLoading from "../../assets/ongoingContestsLoading.gif";
import { BiSearchAlt } from "react-icons/bi";
import { getCookie } from "../../Hooks/useCookies";

const OngoingContestsComponent = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
      route: "contests/getActiveContests",
      authToken: jwt,
      time: formattedTime,
    };

    axios
      .post(baseURL, data)
      .then((response) => {
        console.log("ONGOING", response);
        setContests(response.data.data);
        setFilteredContests(response.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // const filteredContests = contests.filter((contest) =>
  //   contest.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleSearchChange = (event) => {
    const newFilteredContests = contests.filter((contest) =>
      contest.contestName
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    setFilteredContests(newFilteredContests);
    setSearchQuery(event.target.value);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      className={`w-full h-[92.5vh] mx-auto p-4 transition-all duration-1000 ${
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
      {!filteredContests && (
        <div className="absolute flex top-[28%] w-[97%]">
          <img
            src={
              "https://i.pinimg.com/originals/3a/81/05/3a8105197bf6472fa8e825c06a3e5041.gif"
            }
            alt=""
            className="w-[12.5%]"
          />
          <img
            src={
              "https://i.pinimg.com/originals/3a/81/05/3a8105197bf6472fa8e825c06a3e5041.gif"
            }
            alt=""
            className="w-[12.5%]"
          />
          <img
            src={
              "https://i.pinimg.com/originals/3a/81/05/3a8105197bf6472fa8e825c06a3e5041.gif"
            }
            alt=""
            className="w-[12.5%]"
          />
          <img
            src={
              "https://i.pinimg.com/originals/3a/81/05/3a8105197bf6472fa8e825c06a3e5041.gif"
            }
            alt=""
            className="w-[12.5%]"
          />
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="bg-sky-500 text-white">
            <th className="p-4">Contest Number</th>
            <th className="p-4">Contest Name</th>
            <th className="p-4">No. of Contestants</th>
            <th className="p-4">No. of Questions</th>
            <th className="p-4">Start Date</th>
            <th className="p-4">End Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredContests &&
            filteredContests.map((contest, idx) => (
              <tr
                key={idx}
                className="border-b cursor-pointer hover:scale-105 transition-all duration-300 bg-green-50"
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
              </tr>
            ))}
        </tbody>
      </table>
      <p className="mt-5 text-lg font-semibold font-mono mx-auto text-center">
        {filteredContests
          ? "Tip: Click on a contest for details"
          : "Hold on! We're fetching data from our servers..."}
      </p>
    </div>
  );
};

export default OngoingContestsComponent;
