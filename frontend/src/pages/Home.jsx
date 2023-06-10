import React, { useState } from "react";
import { MdWatchLater } from "react-icons/md";
import { ImSigma } from "react-icons/im";
import { BsFillGearFill } from "react-icons/bs";
import { GiBackwardTime } from "react-icons/gi";
import { Link } from "react-router-dom";
import OngoingContestsComponent from "../components/ContestComponents/OngoingContests";

const Home = ({ previousRooms }) => {
  const [contestName, setContestName] = useState("ContestName");
  const tailwindColors = [
    "bg-orange-500",
    "bg-teal-400",
    "bg-pink-600",
    "bg-purple-500",
    "bg-blue-600",
    "bg-yellow-400",
  ];

  return (
    <div className="w-full h-[92.5vh] mx-auto bg-blac flex">
      <div className={`w-1/2 bg-white border-r border-gray-400`}>
        <OngoingContestsComponent />
      </div>
      <div className="w-1/2 h-[92.5vh] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 place-items-center justify-center lg:gap-x-10 overflow-y-scroll bg-gray-200 border-l border-gray-400">
        {/* CARDS */}
        <div className="w-96 h-52 rounded-3xl text-white bg-gradient-to-r from-gray-500 to-gray-300 hover:text-black place-items-center p-5 hover:scale-105 transition-all duration-300">
          Welcome user,
        </div>
        <div className="w-96 h-52 rounded-3xl text-white bg-gradient-to-t from-orange-700 to-orange-400 hover:text-black place-items-center p-5 hover:scale-105 transition-all duration-300">
          <div className="w-11/12 h-full flex flex-col mx-auto justify-center place-items-center gap-y-5">
            <p className="text-2xl font-mono font-semibold">View Contests</p>
            <p className="w-fit text-sm font-mono font-semibold hover:scale-125 transition-all duration-300">
              /contest/all
            </p>
            <div className="grid grid-cols-2 justify-center gap-x-6 gap-y-2">
              <p className="flex place-items-center gap-x-2 font-medium">
                <ImSigma size={18} className="animate-bounce" />
                Total
              </p>
              <p className="flex place-items-center gap-x-2 font-medium">
                In Progress <BsFillGearFill className="animate-spin" />
              </p>
              <p className="flex place-items-center gap-x-2 font-medium justify-between">
                <MdWatchLater size={20} className="animate-pulse" />
                Upcoming
              </p>
              <p className="flex place-items-center gap-x-2 font-medium justify-between">
                Past
                <GiBackwardTime size={24} />
              </p>
            </div>
          </div>
        </div>
        <Link
          to={"/challenge/all"}
          className="w-96 h-52 rounded-3xl text-white bg-gradient-to-b from-sky-700 to-sky-400 hover:text-black place-items-center p-5 hover:scale-105 transition-all duration-300"
        >
          <div className="w-11/12 h-full flex flex-col mx-auto justify-center place-items-center gap-y-5">
            <p className="text-2xl font-mono font-semibold">View Challanges</p>
            <p className="w-fit text-sm font-mono font-semibold hover:scale-125 transition-all duration-300">
              /challenges/all
            </p>
            <p className="flex place-items-center gap-x-2 font-medium">
              <ImSigma size={18} className="animate-bounce" />
              Total
            </p>
          </div>
        </Link>
        <Link
          to={"/contest/create"}
          className="w-96 h-52 rounded-3xl text-white bg-pink-600 hover:bg-pink-700 hover:text-black place-items-center p-5 hover:scale-105 transition-all duration-300"
        >
          <div className="w-11/12 h-full flex flex-col mx-auto justify-center place-items-center gap-y-5">
            <p className="text-2xl font-mono font-semibold">Create Contest</p>
            <p className="w-fit text-sm font-mono font-semibold hover:scale-125 transition-all duration-300">
              /contest/create
            </p>
          </div>
        </Link>
        <Link
          to={"/createChallenge"}
          className="w-96 h-52 rounded-3xl text-white bg-emerald-600 hover:bg-emerald-700 hover:text-black place-items-center p-5 hover:scale-105 transition-all duration-300"
        >
          <div className="w-11/12 h-full flex flex-col mx-auto justify-center place-items-center gap-y-5">
            <p className="text-2xl font-mono font-semibold">Create Challenge</p>
            <p className="w-fit text-sm font-mono font-semibold hover:scale-125 transition-all duration-300">
              /createChallenge
            </p>
          </div>
        </Link>
        <div
          to={`/contest/manage/${contestName}`}
          className="w-96 h-52 rounded-3xl text-white bg-purple-500 hover:bg-purple-600 hover:text-black place-items-center p-5 hover:scale-105 transition-all duration-300"
          // onClick={() => alert("clicked")}
        >
          <div className="w-11/12 h-full flex flex-col mx-auto justify-center place-items-center gap-y-5">
            <p className="text-2xl font-mono font-semibold">Manage Contest</p>
            <p className="w-fit flex text-sm font-mono font-semibold hover:scale-125 transition-all duration-300">
              /contest/manage/
              <input
                type="text"
                name="contestName"
                id="contestName"
                className="w-24 bg-inherit border-b h-5 p-0 outline-none"
                value={contestName}
                onChange={(e) => {
                  setContestName(e.target.value);
                }}
              />
            </p>
            <Link
              to={`/contest/manage/${contestName}`}
              className="flex text-center border rounded-lg px-2 py-1 bg-gray-100 text-black font-mono hover:scale-105 transition-all duration-300"
            >
              Manage Contest
            </Link>
          </div>
        </div>
        {/* CARDS */}
      </div>
    </div>
  );
};

export default Home;
