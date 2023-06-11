import React, { useEffect, useState } from "react";

const Popup = () => {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 1000);
  }, []);
  return (
    <div
      className={`absolute min-w-80 h- right-[8.4%] top-[17vh] bg-green-100 border border-gray-400 rounded-md p-2 opacity-80 ${
        fadeIn && "translate-x-0"
      } translate-x-[570px] transition-all duration-[2000ms] ease-in-out`}
    >
      <p className="text-lg font-mono font-semibold pr-7 pl-3 text-green-600">
        Welcome to managing a new contest
      </p>
      <p className="text-sm font-mono font-semibold pr-7 pl-3 text-green-600">
        Would you like to add participants?
      </p>
      <button className="bg-cyan-600 text-white shadow-md shadow-gray-300 ml-3 my-1 px-3 py-1 rounded-md">
        Add Participants
      </button>
    </div>
  );
};

export default Popup;
