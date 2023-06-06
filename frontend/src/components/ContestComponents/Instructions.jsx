import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";

const Instructions = ({
  instructionsTitle,
  setInstructionsTitle,
  instructions,
  setInstructions,
}) => {
  return (
    <section className="w-full">
      <form className="p-4">
        <div className="py-2">
          <label className="flex place-items-center gap-x-7">
            <p className="w-60 text-3xl text-gray-600">Instructions</p>
          </label>

          <input
            type="text"
            value={instructionsTitle}
            onChange={(e) => setInstructionsTitle(e.target.value)}
            placeholder="Instructions Title"
            className="w-full px-4 py-2 border rounded-md mt-4"
          />
        </div>

        <div className="mt-4">
          {instructions.map((instruction, idx) => {
            return (
              <div className="mt-2">
                <label className="flex place-items-center gap-x-7">
                  <p className="w-60 font-medium text-gray-600 pl-3">
                    Instruction {idx + 1}
                  </p>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => {
                      const newInstructions = [...instructions];
                      newInstructions[idx] = e.target.value;
                      setInstructions(newInstructions);
                    }}
                    placeholder="Enter Instruction"
                    className="w-60 px-4 py-2 border rounded-md"
                  />
                  <AiFillDelete
                    className="ml-5 mt-2 cursor-pointer text-red-500"
                    size={25}
                    onClick={() => {
                      const newInstructions = [...instructions];
                      newInstructions.splice(idx, 1);
                      setInstructions(newInstructions);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}

        {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
        {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
        <button
          type="submit"
          className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-300 font-mono my-4"
          onClick={(e) => {
            e.preventDefault();
            setInstructions([...instructions, ""]);
          }}
        >
          Add Instructions
        </button>
      </form>
    </section>
  );
};

export default Instructions;
