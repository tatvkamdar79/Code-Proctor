import React from "react";
import { useLocation } from "react-router-dom";

const ThankYou = () => {
  const { state } = useLocation();
  const contestantEmail = state?.email;
  console.log(contestantEmail);
  const handleSubmit = async () => {
    // Code
  };
  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/2 bg-green-600" />
      <div className="w-1/2 bg-gray-950" />
      <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center place-items-center text-center text-7xl text-white font-mono font-semibold">
        <p>Thank You</p>
        <p className="text-4xl">
          You can reach out to us in case of any queries {":)"}
        </p>
        <div className="flex my-20">
          <div className="w-1/2 px-48 flex flex-col gap-y-2">
            <p className="text-xl">How was the test?</p>
            <textarea
              name=""
              id=""
              cols="40"
              rows="4"
              className="bg-green-700 text-lg w-full text-white p-4 placeholder-gray-100"
              placeholder="Type Here..."
            />
            <button className="w-5/6 mx-auto text-base border bg-gray-800 hover:w-full py-1 hover:scale-y-105 transition-all duration-300">
              Submit
            </button>
          </div>
          <div className="w-1/2 px-48 flex flex-col gap-y-2">
            <p className="text-xl">Report an Error or Bug!</p>
            <textarea
              name=""
              id=""
              cols="40"
              rows="4"
              className="bg-gray-800 text-lg w-full text-white p-4 placeholder-gray-100"
              placeholder="Type Here..."
            />
            <button className="w-5/6 mx-auto text-base border bg-green-700 hover:w-full py-1 hover:scale-y-105 transition-all duration-300">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
