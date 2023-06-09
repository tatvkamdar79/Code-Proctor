import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full h-16 border border-black bg-black text-white">
      <div className="w-11/12 h-full flex justify-between place-items-center mx-auto">
        <div className="flex gap-x-32">
          <p className="font-semibold text-3xl font-mono py-5">D B C</p>
          <div className="flex place-items-center">
            <ul className="flex gap-x-5 font-semibold font-mono text-md">
              <li className="px-10 text-center py-5 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                Home
              </li>
              <li className="px-10 text-center py-5 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                Create Challenge
              </li>
              <li className="px-10 text-center py-5 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                Create Contest
              </li>
              <li className="px-10 text-center py-5 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                View Contests
              </li>
              <li className="px-10 text-center py-5 cursor-pointer transition-all duration-200 text-gray-200 hover:text-white hover:bg-gray-600">
                View Problems
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
