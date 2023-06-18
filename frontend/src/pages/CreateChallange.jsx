import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../config/config";
import { getCookie } from "../Hooks/useCookies";
import createChallengeLoadingGif from "../assets/createChallengeLoading.gif";

const CreateChallange = () => {
  const navigate = useNavigate();
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [tags, setTags] = useState([""]);
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
  const [submitting, setSubmitting] = useState(false);

  const handleAddPublicTestCase = () => {
    if (publicTestCases.length < 2) {
      setPublicTestCases([...publicTestCases, { input: "", output: "" }]);
    }
  };

  const handleAddTag = () => {
    setTags([...tags, ""]);
  };

  const handleDeleteTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  const handleTagChange = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setTags(updatedTags);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to add this question to question bank"
      )
    ) {
      return;
    }

    if (submitted) {
      return;
    }

    const correctPublicTestCases = publicTestCases.filter(
      (tc) => tc.input.length > 0 && tc.output.length > 0
    );
    const correctHiddenTestCases = hiddenTestCases.filter(
      (tc) => tc.input.length > 0 && tc.output.length > 0
    );

    let sampleTCs = [
      { input: sampleInput, output: sampleOutput },
      ...correctPublicTestCases,
    ];
    const questionData = {
      title: questionTitle,
      description: questionDescription,
      sampleTCs: sampleTCs,
      hiddenTCs: correctHiddenTestCases,
      score,
      tags,
    };
    setSubmitting(true);
    const data = {
      authToken: jwt,
      route: "problems/create",
      ...questionData,
    };
    try {
      const response = await axios.post(baseURL, data);
      console.log(response);
      setSubmitting(false);
      setSubmitted(true);
      navigate("/challenge/all", { state: { questionTitle } });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
    }
  };

  return (
    <div className={`bg-white ${submitting && "blur-[3px]"}`}>
      <h2 className="w-11/12 mx-auto mb-4 underline text-4xl font-semibold">
        Create a Challenge
      </h2>
      <div className="w-5/6 mx-auto bg-gray-50 p-5 rounded-xl shadow-xl shadow-gray-300">
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
          <div className="flex w-full justify-between mb-3">
            <div className="w-1/2 pr-5">
              <label
                htmlFor="sampleInput"
                className="block text-xl font-bold mb-2"
              >
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
            <div className="w-1/2 pl-5">
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
          </div>
          <div className="mb-3"></div>
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
                      handlePublicTestCaseChange(
                        index,
                        "output",
                        e.target.value
                      )
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
                      handleHiddenTestCaseChange(
                        index,
                        "output",
                        e.target.value
                      )
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
          <div className="mb-3">
            <label htmlFor="tags" className="block text-xl font-bold mb-2">
              Tags
            </label>
            <div className="grid grid-cols-5 place-items-center">
              {tags.map((tag, index) => (
                <div key={index} className="flex place-items-center gap-x-2">
                  <span className="font-medium text-2xl">#</span>
                  <input
                    type="text"
                    className="block w-40 px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                    placeholder="Tag"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:outline-none text-white rounded-md"
                    onClick={() => handleDeleteTag(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="my-3 px-4 py-2 rounded-md font-semibold text-white bg-sky-500 hover:bg-sky-600 focus:bg-sky-600 focus:outline-none"
              onClick={handleAddTag}
            >
              Add Tag
            </button>
          </div>
          <div className="w-full flex place-items-center justify-center">
            <button
              type="submit"
              className={`w-[65%] mx-auto my-6 px-6 py-3 rounded-md text-lg font-semibold text-white opacity-60 ${
                submitted
                  ? "bg-green-600"
                  : "bg-cyan-500 hover:bg-cyan-600 focus:bg-cyan-600"
              } focus:outline-none`}
              disabled={submitted}
            >
              {submitted ? "Challenge Added" : "Add Challenge"}
            </button>
          </div>
        </form>
      </div>
      {submitting && (
        <div className="absolute w-full h-screen top-0 left-0 justify-center place-items-center flex">
          <div
            className="w-1/2 h-1/2 translate-x-9"
            style={{ backgroundImage: `url(${createChallengeLoadingGif})` }}
          />
        </div>
      )}
    </div>
  );
};

export default CreateChallange;
