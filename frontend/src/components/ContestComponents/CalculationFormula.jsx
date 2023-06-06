import React, { useState } from "react";

const CreateContestCalculationFormula = ({ contest, setContest }) => {
  const [testCasesWeightage, setTestCasesWeightage] = useState(100);
  const [timeSpentWeightage, setTimeSpentWeightage] = useState(0);

  const handleTestCasesWeightageChange = (e) => {
    if (e.target.value > 100 || e.target.value < 0) {
      return;
    }
    setTestCasesWeightage(e.target.value);
    setTimeSpentWeightage(100 - e.target.value);
  };

  const handleTimeSpentWeightageChange = (e) => {
    if (e.target.value > 100 || e.target.value < 0) {
      return;
    }
    setTestCasesWeightage(100 - e.target.value);
    setTimeSpentWeightage(e.target.value);
  };

  return (
    <section className="w-full flex flex-col justify-evenly mx-auto">
      <p className="font-mono font-semibold text-3xl underline p-5">
        Calculation Formula
      </p>
      <div className="flex">
        <div className="w-full flex justify-center place-items-center gap-x-3 p-4">
          <label
            htmlFor="testCasesWeightage"
            className="font-medium text-xl text-gray-800"
          >
            Total Test Cases Passed Weightage
          </label>
          <input
            type="number"
            id="testCasesWeightage"
            value={testCasesWeightage}
            onChange={handleTestCasesWeightageChange}
            min={0}
            max={100}
            className="w-20 h-10 px-4 py-2 border rounded-md font-semibold text-lg"
          />
        </div>

        <div className="w-full flex justify-center place-items-center gap-x-3 p-4">
          <label
            htmlFor="timeSpentWeightage"
            className="font-medium text-xl text-gray-800"
          >
            Time Spent Per Question Weightage
          </label>
          <input
            type="number"
            id="timeSpentWeightage"
            value={timeSpentWeightage}
            onChange={handleTimeSpentWeightageChange}
            min={0}
            max
            className="w-20 h-10 px-4 py-2 border rounded-md font-semibold text-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default CreateContestCalculationFormula;
