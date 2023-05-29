import React, { useState, useEffect } from "react";
import CreateQuestion from "./CreateQuestion";
import { TbClockCancel } from "react-icons/tb";
import { BsStopwatchFill } from "react-icons/bs";
import { BsHourglassSplit } from "react-icons/bs";

const CreateTest = () => {
  const [questions, setQuestions] = useState([]);
  const [testName, setTestName] = useState("");
  const [questionsData, setQuestionsData] = useState([]);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  useEffect(() => {
    // Update start time every 30 seconds
    const interval = setInterval(() => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");

      const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      if (new Date(startDateTime) < new Date(currentDateTime)) {
        setStartDateTime(currentDateTime);
        setEndDateTime(currentDateTime);
      }
    }, 5 * 1000); // 30 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");

    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    setStartDateTime(currentDateTime);
    setEndDateTime(currentDateTime);
  }, []);

  const handleQuestionSubmit = (questionData) => {
    setQuestionsData([...questionsData, questionData]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission or validation here
    console.log({
      testName,
      startDateTime,
      endDateTime,
      questions: questionsData, // Include questions' data in the submitted data
    });
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, {}]);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    const updatedQuestionsData = [...questionsData];
    updatedQuestionsData.splice(index, 1);
    setQuestions(updatedQuestions);
    setQuestionsData(updatedQuestionsData);
  };

  const handleStartDateTimeChange = (e) => {
    const newStartDateTime = e.target.value;
    const currentDateTime = new Date().toISOString().slice(0, 16);
    if (newStartDateTime >= currentDateTime) {
      setStartDateTime(newStartDateTime);
      setEndDateTime(newStartDateTime);
    }
  };

  const handleEndDateTimeChange = (e) => {
    const newEndDateTime = e.target.value;
    if (newEndDateTime >= startDateTime) {
      setEndDateTime(newEndDateTime);
    }
  };

  const calculateTestDuration = () => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    const diff = Math.abs(end - start);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} days, ${hours} hours, ${minutes} minutes`;
  };

  return (
    <div className="w-11/12 mx-auto">
      <h1 className="w-full text-4xl text-center font-semibold underline mb-4 justify-self-center place-self-center">
        Create New Test
      </h1>
      <div className="p-5 m-5 border-2 border-gray-300 rounded-md shadow-lg shadow-gray-400">
        <div className="flex justify-center mb-3 gap-x-10">
          <label htmlFor="testName" className="text-3xl font-semibold">
            Test Name
          </label>
          <input
            type="text"
            className="block w-3/5 px-4 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-green-400"
            id="testName"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-3 justify-center place-items-center">
          <div className="flex flex-col place-items-center mb-3 col-2 border border-gray-300 rounded-md my-4" style={{ minWidth: "270px" }}>
            <label
              htmlFor="startDateTime"
              className="block text-xl mb-2 font-semibold align-items-center text-center"
            >
              <BsStopwatchFill
                size={21}
                style={{ marginRight: "5px" }}
                className="inline"
              />
              Begin Test
            </label>
            <input
              type="datetime-local"
              className="form-control w-2/3"
              id="startDateTime"
              value={startDateTime}
              onChange={handleStartDateTimeChange}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div className="flex flex-col place-items-center mb-3 col-2 border border-gray-300 rounded-md my-4" style={{ minWidth: "270px" }}>
            <label
              htmlFor="endDateTime"
              className="block text-xl mb-2 font-semibold align-items-center text-center"
            >
              <TbClockCancel
                size={22}
                style={{ marginRight: "5px" }}
                className="inline"
              />
              End Test
            </label>
            <input
              type="datetime-local"
              className="form-control w-2/3"
              id="endDateTime"
              value={endDateTime}
              onChange={handleEndDateTimeChange}
              min={startDateTime}
              required
            />
          </div>
          <div className="flex flex-col place-items-center mb-3 border border-gray-300 my-4 px-10 rounded-md shadow shadow-green-200">
            <label className="block text-xl mb-2 font-semibold align-items-center">
              <BsHourglassSplit
                size={20}
                style={{ marginRight: "5px" }}
                className="inline"
              />
              Test Duration:
            </label>
            <b>{calculateTestDuration()}</b>
          </div>
        </div>
      </div>
      {questions.map((_, index) => (
        <div key={index} className="border-2 p-6 ">
          <CreateQuestion
            onQuestionSubmit={handleQuestionSubmit}
            questionNumber={index + 1}
            question={questionsData.length > index ? questionsData[index] : {}}
            x={questions}
          />
          <div className="w-[65%] mx-auto flex flex-row-reverse">
            <button
              type="button"
              className="w-full my-2 px-6 py-3 rounded-md text-lg font-semibold text-white bg-red-500 hover:bg-red-600 focus:bg-red-500 focus:outline-none"
              onClick={() => handleDeleteQuestion(index)}
            >
              Delete Question
            </button>
          </div>
          <hr />
        </div>
      ))}
      <div className="flex mx-auto m-5 gap-x-10 justify-center place-items-center">
        <button
          type="button"
          className="px-6 py-3 text-lg rounded-md font-semibold text-white bg-green-600 hover:bg-green-600 focus:bg-green-600 focus:outline-none"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
        <br />
        <button
          type="submit"
          className="px-6 py-3 text-lg rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
          onClick={handleSubmit}
        >
          Publish Test
        </button>
      </div>
    </div>
  );
};

export default CreateTest;
