import React, { useState } from "react";
import { MdWatchLater } from "react-icons/md";
import { ImSigma } from "react-icons/im";
import { BsFillGearFill } from "react-icons/bs";
import { GiBackwardTime } from "react-icons/gi";
import { Link } from "react-router-dom";
import OngoingContestsComponent from "../components/ContestComponents/OngoingContests";

const Home = ({ previousRooms }) => {
  const [contestName, setContestName] = useState("ContestName");
  // const tailwindColors = [
  //   "bg-orange-500",
  //   "bg-teal-400",
  //   "bg-pink-600",
  //   "bg-purple-500",
  //   "bg-blue-600",
  //   "bg-yellow-400",
  // ];

  return (
    <div className="w-full h-[92.5vh] mx-auto flex">
      <div className="w-1/2 bg-white border-r border-gray-400">
        <OngoingContestsComponent />
      </div>
      <div className="w-1/2 h-[94vh] mx-auto bg-gray-200 border-l border-gray-400 overflow-y-scroll">
        {/* CARDS */}
        <div className="font-semibold font-mono text-2xl text-gray-600 w-full my-5">
          <p className="w-11/12 mx-auto tracking-wider">Contest Properties</p>
          <div className="h-0.5 w-11/12 mx-auto bg-gray-400" />
        </div>

        {/* <div className="w-96 h-52 rounded-3xl text-green-600 border border-black hover:text-black place-items-center p-5 hover:scale-105 transition-all duration-300 bg-gradient-to-r ">
          <div className="w-11/12 h-full flex flex-col mx-auto justify-center place-items-center gap-y-5">
          Code Pair
          </div>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 place-items-center justify-center lg:gap-x-10 gap-y-10">
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
          <div
            to={`/contest/manage/${contestName}`}
            className="w-96 h-52 rounded-3xl text-white bg-gradient-to-b from-cyan-600 to-cyan-400 hover:text-black place-items-center p-2 px-4 hover:scale-105 transition-all duration-300 bg-no-repeat bg-cover"
            // onClick={() => alert("clicked")}
            style={{
              backgroundImage:
                'url("https://i.pinimg.com/originals/7f/b7/8a/7fb78a1d3212f65e72c33a5af4af6c3b.gif"',
            }}
          >
            <div className="w-full flex flex-col mx-auto justify-center place-items-center gap-y-1 text-[#3a88b5]">
              <div className="w-full h-14 mx-auto flex flex-col gap-y-1">
                <p className="text-2xl font-mono font-semibold">
                  Manage Contest
                </p>
                <p className="w-fit flex text-sm font-mono font-semibold hover:scale-125 transition-all duration-300">
                  /contest/manage/
                  <input
                    type="text"
                    name="contestName"
                    id="contestName"
                    className="w-24 bg-inherit border-b h-5 p-0 outline-none text-gray-800"
                    value={contestName}
                    onChange={(e) => {
                      setContestName(e.target.value);
                    }}
                  />
                </p>
              </div>
              <div className="w-full flex justify-start place-items-start">
                <Link
                  to={`/contest/manage/${contestName}`}
                  className="w-fit text-sm text-center border rounded-lg px-3 py-1 text-black font-mono hover:scale-105 transition-all duration-[400ms] font-semibold bg-gray-300 hover:bg-opacity-70 bg-opacity-30 shadow-lg shadow-gray-400"
                >
                  Manage
                </Link>
              </div>
            </div>
          </div>
          <Link
            to={"/contest/create"}
            className="w-96 h-52 rounded-3xl text-cyan-700 bg-gradient-tob from-sky-700 to-sky-400 hover:text-gray-700 p-2 px-4 hover:scale-105 transition-all duration-300 bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                'url("https://i.pinimg.com/originals/85/04/77/850477fed08bfe98598082bcd309ce70.gif")',
            }}
          >
            <div className="w-full h-14 flex flex-col mx-auto justify-between place-items-center">
              <p className="text-2xl font-mono font-semibold place-self-start">
                Create A New Contest
              </p>
              <p className="text-sm font-mono font-semibold hover:scale-125 transition-all duration-300 place-self-start ">
                /contest/create
              </p>
            </div>
          </Link>
        </div>

        <div className="font-semibold font-mono text-2xl text-gray-600 w-full my-5">
          <p className="w-11/12 mx-auto tracking-wider">Challenge Properties</p>
          <div className="h-0.5 w-11/12 mx-auto bg-gray-400" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 place-items-center justify-center lg:gap-x-10 gap-y-10">
          <Link
            to={"/challenge/create"}
            className="w-96 h-52 rounded-3xl text-white bg-gradient-to- from-emerald-700 to-emerald-400 hover:text-black place-items-center p-5 hover:scale-105 transition-all duration-300 bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                'url("https://i.pinimg.com/originals/10/88/13/108813b4ca5d4767cc4a6bafe030a5e9.gif")',
              // backgroundImage:
              // 'url("https://i.pinimg.com/originals/20/36/4f/20364f89675f128c63fb4e86c85e372b.gif")',
            }}
          >
            <div className="w-11/12 h-full flex flex-col mx-auto justify-center place-items-center gap-y-5">
              <p className="text-2xl font-mono font-semibold">
                Create Challenge
              </p>
              <p className="w-fit text-sm font-mono font-semibold hover:scale-125 transition-all duration-300">
                /challenge/create
              </p>
            </div>
          </Link>
          <Link
            to={"/challenge/all"}
            className="w-96 h-52 rounded-3xl text-white bg-gradient-to-t from-emerald-700 to-emerald-400 hover:text-black place-items-center p-5 hover:scale-105 transition-all duration-300 bg-repeat-x bg-cover"
            style={{
              backgroundImage:
                // 'url("https://i.pinimg.com/originals/2d/62/23/2d62230ef5cc7d0af0eb7868c0cf4ac4.gif")',
                'url("https://i.pinimg.com/originals/6b/6e/6a/6b6e6ad625caf5cfe546a67a2f545231.gif")',
            }}
          >
            <div className="w-11/12 h-full flex flex-col mx-auto justify-center place-items-center gap-y-5">
              <p className="text-2xl font-mono font-semibold">
                View Challenges
              </p>
              <p className="w-fit text-sm font-mono font-semibold hover:scale-125 transition-all duration-300">
                /challenge/all
              </p>
            </div>
          </Link>
          <Link
            to={"/create-group"}
            className="w-96 h-52 rounded-3xl text-white bg-gradient-to-t from-gray-700 to-gray-400 hover:text-black place-items-center p-5 hover:scale-105 transition-all duration-300"
          >
            <div className="w-11/12 h-full flex flex-col mx-auto justify-center place-items-center gap-y-5">
              <p className="text-2xl font-mono font-semibold">Create A Group</p>
              <p className="w-fit text-sm font-mono font-semibold hover:scale-125 transition-all duration-300">
                /create-group
              </p>
            </div>
          </Link>
          {/* CARDS */}
        </div>
      </div>
    </div>
  );
};

export default Home;
