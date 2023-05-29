import React, { useEffect, useState } from "react";

const CreateQuestion = ({ onQuestionSubmit, questionNumber, question, x }) => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [publicTestCases, setPublicTestCases] = useState([
    { input: "", output: "" },
  ]);
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: "", output: "" },
    { input: "", output: "" },
    { input: "", output: "" },
  ]);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    console.log(question);
    if (Object.keys(question).length > 0) {
      setQuestionTitle(question.questionTitle);
      setQuestionDescription(question.questionDescription);
      setSampleInput(question.sampleInput);
      setSampleOutput(question.sampleOutput);
      setPublicTestCases(question.publicTestCases);
      setHiddenTestCases(question.hiddenTestCases);
      setScore(question.score);
    }
  }, [x]);

  const handleAddPublicTestCase = () => {
    if (publicTestCases.length < 2) {
      setPublicTestCases([...publicTestCases, { input: "", output: "" }]);
    }
  };

  const handleAddHiddenTestCase = () => {
    setHiddenTestCases([...hiddenTestCases, { input: "", output: "" }]);
  };

  const handleDeleteHiddenTestCase = (index) => {
    const updatedTestCases = [...hiddenTestCases];
    updatedTestCases.splice(index, 1);
    setHiddenTestCases(updatedTestCases);
  };

  const handlePublicTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...publicTestCases];
    updatedTestCases[index][field] = value;
    setPublicTestCases(updatedTestCases);
  };

  const handleHiddenTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...hiddenTestCases];
    updatedTestCases[index][field] = value;
    setHiddenTestCases(updatedTestCases);
  };

  const handleScoreChange = (e) => {
    setScore(parseInt(e.target.value));
  };

  useEffect(() => {
    if (
      questionTitle == "" ||
      questionDescription == "" ||
      sampleInput.length == 0 ||
      sampleOutput.length == 0 ||
      publicTestCases.length == 0 ||
      hiddenTestCases.length == 0
    ) {
      setSubmitted(false);
    }
  }, [
    questionTitle,
    questionDescription,
    sampleInput,
    sampleOutput,
    publicTestCases,
    hiddenTestCases,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) {
      return;
    }
    const questionData = {
      questionTitle,
      questionDescription,
      sampleInput,
      sampleOutput,
      publicTestCases,
      hiddenTestCases,
      score,
    };
    setSubmitted(true);
    onQuestionSubmit(questionData);
  };

  return (
    <div className="w-full mx-auto">
      <h2 className="mb-4 underline text-2xl font-semibold">
        Question {questionNumber}
      </h2>
      {submitted ? (
        <p className="text-green-600 font-semibold">
          Question added to the test*
        </p>
      ) : (
        <p className="text-red-600 font-semibold">
          You have not added this question to the test*
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="questionTitle"
            className="block text-xl font-bold mb-2"
          >
            Question Title*
          </label>
          <textarea
            type="text"
            className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
            id="questionTitle"
            required
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="questionDescription"
            className="block text-xl font-bold mb-2"
          >
            Question Description*
          </label>
          <textarea
            className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
            id="questionDescription"
            rows="3"
            required
            value={questionDescription}
            onChange={(e) => setQuestionDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3 col-8">
          <label htmlFor="sampleInput" className="block text-xl font-bold mb-2">
            Sample Input*
          </label>
          <textarea
            type="text"
            className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
            id="sampleInput"
            required
            value={sampleInput}
            onChange={(e) => setSampleInput(e.target.value)}
            rows={2}
          />
        </div>
        <div className="mb-3 col-8">
          <label
            htmlFor="sampleOutput"
            className="block text-xl font-bold mb-2"
          >
            Sample Output*
          </label>
          <textarea
            type="text"
            className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
            id="sampleOutput"
            required
            value={sampleOutput}
            onChange={(e) => setSampleOutput(e.target.value)}
            rows={2}
          />
        </div>
        <div className="mb-3">
          <label className="block text-xl font-bold mb-2">
            Public Test Cases
          </label>
          {publicTestCases.map((testCase, index) => (
            <div key={index} className="flex gap-x-5">
              <div className="w-5/12 mb-2">
                <textarea
                  type="text"
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                  placeholder="Input"
                  value={testCase.input}
                  onChange={(e) =>
                    handlePublicTestCaseChange(index, "input", e.target.value)
                  }
                />
              </div>
              <div className="w-5/12 mb-2">
                <textarea
                  type="text"
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                  placeholder="Output"
                  value={testCase.output}
                  onChange={(e) =>
                    handlePublicTestCaseChange(index, "output", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          {publicTestCases.length < 2 && (
            <button
              type="button"
              className="px-4 py-2 rounded-md font-semibold text-white bg-sky-500 hover:bg-sky-600 focus:bg-sky-600 focus:outline-none"
              onClick={handleAddPublicTestCase}
            >
              Add Public Test Case
            </button>
          )}
        </div>
        <div className="mb-3">
          <label className="block text-xl font-bold mb-2">
            Hidden Test Cases
          </label>
          {hiddenTestCases.map((testCase, index) => (
            <div key={index} className="flex gap-x-5 place-items-center">
              <div className="w-5/12 mb-2">
                <textarea
                  type="text"
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                  placeholder="Input"
                  value={testCase.input}
                  onChange={(e) =>
                    handleHiddenTestCaseChange(index, "input", e.target.value)
                  }
                />
              </div>
              <div className="w-5/12 mb-2">
                <textarea
                  type="text"
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                  placeholder="Output"
                  value={testCase.output}
                  onChange={(e) =>
                    handleHiddenTestCaseChange(index, "output", e.target.value)
                  }
                />
              </div>
              <div className="mb-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md text-lg font-semibold text-white bg-red-500 hover:bg-red-600 focus:bg-red-500 focus:outline-none"
                  onClick={() => handleDeleteHiddenTestCase(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="px-4 py-2 rounded-md font-semibold text-white bg-sky-500 hover:bg-sky-600 focus:bg-sky-600 focus:outline-none"
            onClick={handleAddHiddenTestCase}
          >
            Add Hidden Test Case
          </button>
        </div>
        <div className="mb-3 col-1">
          <label htmlFor="score" className="block text-xl font-bold mb-2">
            Score*
          </label>
          <input
            className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
            type="number"
            name="score"
            id="score"
            value={score}
            onChange={handleScoreChange}
            min={0}
            max={100}
            style={{ minWidth: "100px" }}
          />
        </div>
        <div className="w-full flex place-items-center justify-center">
          <button
            type="submit"
            className={`w-[65%] mx-auto mt-6 px-6 py-3 rounded-md text-lg font-semibold text-white ${
              submitted
                ? "bg-green-500"
                : "bg-cyan-500 hover:bg-cyan-600 focus:bg-cyan-600"
            } focus:outline-none`}
            disabled={submitted}
          >
            {submitted ? "Added to Test" : "Add Question to Test"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
