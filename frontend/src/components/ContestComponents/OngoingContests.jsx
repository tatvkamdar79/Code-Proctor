import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../config/config";

const OngoingContestsComponent = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Simulating API call to set the contests state variable
  // Replace this with your actual API call
  useEffect(() => {
    let time = new Date(Date.now()).toLocaleDateString().split("/");
    const formattedTime = `${time[2]}-${time[1]}-${time[0]}`;
    const data = {
      route: "contests/getActiveContests",
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI3MjY5NDd9.TUuWc-2EbVViBKjJMXK4OAK_GQarhn2qzHWG4JR4jmE",
      time: formattedTime,
    };

    axios
      .post(baseURL, data)
      .then((response) => {
        setContests(response.data.data);
        // console.log(response.data.data);
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
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search contest name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-1/3 p-4 border border-gray-300 rounded-lg mx-auto"
        />
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-4">Contest Number</th>
            <th className="p-4">Contest Name</th>
            <th className="p-4">No. of Contestants</th>
            <th className="p-4">No. of Questions</th>
            <th className="p-4">Start Date</th>
            <th className="p-4">End Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredContests.map((contest, idx) => (
            <tr
              key={contest.id}
              className="border-b cursor-pointer"
              onClick={() => navigate(`/contest/manage/${contest.contestName}`)}
            >
              <td className="p-4 text-center font-semibold font-mono">
                {idx + 1}
              </td>
              <td className="p-4 text-center font-semibold font-mono">
                {contest.contestName}
              </td>
              <td className="p-4 text-center font-semibold font-mono">
                {contest.contestants.length}
              </td>
              <td className="p-4 text-center font-semibold font-mono">
                {contest.questions.length}
              </td>
              <td className="p-4 text-center font-semibold font-mono">
                {formatDate(contest.contestStartDate.sec * 1000)}
              </td>
              <td className="p-4 text-center font-semibold font-mono">
                {formatDate(contest.contestEndDate.sec * 1000)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OngoingContestsComponent;
