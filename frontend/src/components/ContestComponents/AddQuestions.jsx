import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiSearchAlt, BiSearchAlt2 } from "react-icons/bi";
import { SiSketchfab } from "react-icons/si";
import { useParams } from "react-router-dom";
import { baseURL } from "../../config/config";

const CreateContestAddQuestions = ({ contest, setContest }) => {
  const { currentContestName } = useParams();
  const [selectedQuestions, setSelectedQuestions] = useState(contest.questions);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [problems, setProblems] = useState([]);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    axios
      .post(baseURL, {
        authToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1Mzk1OTl9.wyOmQgp8FpwzjxU7Ih0e29d8RotSxtPgDTQkRy5tr3Q",
        route: "problems/getAllProblems",
      })
      .then((response) => {
        console.log(response.data.data.allProblems);
        setProblems(response.data.data.allProblems);
        setSearchResults(response.data.data.allProblems);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let alreadySelectedQuestionsIds = contest.questions
      .map((q) => q._id.$oid)
      .sort();
    let newSelectedQuestionsIds = selectedQuestions
      .map((q) => q._id.$oid)
      .sort();
    if (alreadySelectedQuestionsIds.length !== newSelectedQuestionsIds.length) {
      setChanged(true);
      return;
    }
    for (let i = 0; i < newSelectedQuestionsIds.length; i++) {
      if (newSelectedQuestionsIds[i] !== alreadySelectedQuestionsIds[i]) {
        setChanged(true);
        return;
      }
    }
    setChanged(false);
  }, [selectedQuestions]);

  const saveChanges = () => {
    if (!changed) {
      return;
    }

    let alreadySelectedQuestionsIds = contest.questions.map((q) => q._id.$oid);
    let newSelectedQuestionsIds = selectedQuestions.map((q) => q._id.$oid);
    console.log("alreadySelectedQuestionsIds", alreadySelectedQuestionsIds);
    console.log(newSelectedQuestionsIds);

    axios
      .post(baseURL, {
        authToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1NDEzMzZ9.AB0kpYjkD0zIMBDi_-Q980FRY3XG_X4K4P9asTxll2c",
        route: "contests/modifyQuestions",
        contestId: contest._id.$oid,
        updatedQuestions: newSelectedQuestionsIds,
      })
      .then((res) => {
        if (res.status === 200) {
          alert("Questions changed successfully");
        }
      })
      .catch((err) => {
        console.error(err);
      });

    const data = {
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1MjE1ODV9.3-O-JVP8eaYRPtXo0q8pTDc3HY3sN91PXDGPmrbqsDo",
      route: "contests/getContestDetails",
      contestName: currentContestName,
    };
    axios
      .post(baseURL, data)
      .then((response) => {
        setContest(response.data.data.contest);
        console.log(response.data);
        console.log(response.data.data.contest._id["$oid"]);
        setChanged(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = (query) => {
    const results = problems.filter((question) =>
      question.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddQuestion = (question) => {
    const isQuestionSelected = selectedQuestions.some(
      (selectedQuestion) => selectedQuestion._id.$oid === question._id.$oid
    );

    if (!isQuestionSelected) {
      setSelectedQuestions((prevQuestions) => [...prevQuestions, question]);
    }
  };

  const handleRemoveQuestion = (question) => {
    setSelectedQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q._id.$oid !== question._id.$oid)
    );
  };

  return (
    <section className="w-11/12 mx-auto">
      <div className="flex place-items-center justify-evenly py-3">
        <BiSearchAlt size={40} className="inline w-[5%]" />
        <input
          type="text"
          value={searchQuery}
          onFocus={() => setSearching(true)}
          onBlur={() => {
            setTimeout(() => setSearching(false), 180);
          }}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search challenges..."
          className="w-full mx-auto px-4 py-2 border-2 border-gray-400 rounded-md outline-green-600"
        />
      </div>
      <div className="flex w-full justify-end relative bottom-3">
        <div
          className={`w-[95%] justify-self-end max-h-72 overflow-y-scroll bg-gray-200 px-4 ${
            searching && "border-2 border-gray-400"
          }`}
        >
          {searching &&
            searchResults.map((question) => (
              <div
                key={question?._id?.$oid}
                className="h-14 flex items-center justify-between px-4 py-2 mt-2 border border-gray-400 bg-white rounded-md relative"
              >
                <p className="font-mono font-medium text-md overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  {question.title}
                </p>
                <button
                  onClick={() => handleAddQuestion(question)}
                  disabled={selectedQuestions.some(
                    (selectedQuestion) =>
                      selectedQuestion._id.$oid === question._id.$oid
                  )}
                  className={`px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 ${
                    selectedQuestions.some(
                      (selectedQuestion) =>
                        selectedQuestion._id.$oid === question._id.$oid
                    ) && "opacity-40"
                  }`}
                >
                  Add Question
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className="bg-gray-100 p-7 rounded-md">
        <p className="font-semibold text-3xl font-mono underline">
          Selected Questions:
        </p>
        {selectedQuestions.map((question) => (
          <div
            key={question._id.$oid}
            className="flex items-center font-mono font-semibold text-xl place-items-center py-2 justify-between px-10 border-b border-gray-400"
          >
            <p>{question.title}</p>
            <button
              onClick={() => handleRemoveQuestion(question)}
              className="px-14 py-3 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className={`px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-300 font-mono my-4 ${
          changed && "bg-orange-500"
        }`}
        disabled={!changed}
        onClick={saveChanges}
      >
        Save Changes
      </button>
    </section>
  );
};

export default CreateContestAddQuestions;
