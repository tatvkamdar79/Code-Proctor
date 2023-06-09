import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiSearchAlt, BiSearchAlt2 } from "react-icons/bi";
import { SiSketchfab } from "react-icons/si";
import { useParams } from "react-router-dom";
import { baseURL } from "../../config/config";
import loading from "../../assets/addQuestionsLoading.gif";
import { MdOutlineAddCircle } from "react-icons/md";

const CreateContestAddQuestions = ({ contest, setContest }) => {
  const { currentContestName } = useParams();
  const [selectedQuestions, setSelectedQuestions] = useState(contest.questions);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [problems, setProblems] = useState([]);
  const [changed, setChanged] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);

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

    setSavingChanges(true);

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
          setSavingChanges(false);
        }
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
      })
      .catch((err) => {
        console.error(err);
        setSavingChanges(false);
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
      <div
        className={`grid grid-cols-2 justify-center place-items-center gap-x-10 ${
          savingChanges && "opacity-20"
        }`}
      >
        <div className="w-full h-[50vh] border border-gray-400 rounded-lg py-10 px-5">
          <div className="flex place-items-center justify-evenly">
            <BiSearchAlt size={40} className="inline w-[5%]" />
            <input
              type="text"
              value={searchQuery}
              id="searchBar"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search challenges..."
              className="w-full h-full mx-auto px-4 py-2 border-2 border-gray-400 rounded-md outline-green-600"
            />
          </div>
          <div className="flex w-full h-full justify-end pb-2">
            <div
              className={`w-[95%] h-[97%] mt-3.5 justify-self-end bg-white px-4 overflow-hidden ${
                searchResults &&
                "overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
              }`}
            >
              {searchResults ? (
                searchResults.map((question) => (
                  <div
                    key={question?._id?.$oid}
                    className="h-14 flex items-center justify-between px-4 py-2 mt-2 border border-gray-400 bg-green-50 rounded-md relative"
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
                      className={`px-2 py-2 text-sm text-white rounded-full hover:bg-green-200 transition-all duration-500 font-mono font-semibold ${
                        selectedQuestions.some(
                          (selectedQuestion) =>
                            selectedQuestion._id.$oid === question._id.$oid
                        ) && "opacity-40"
                      }`}
                    >
                      <MdOutlineAddCircle
                        size={30}
                        className="text-green-600"
                      />
                    </button>
                  </div>
                ))
              ) : (
                <div className="w-[95%] h-full grid grid-cols-2">
                  <img src={loading} alt="" className="w-full" />
                  <img src={loading} alt="" className="w-full" />
                  <img src={loading} alt="" className="w-full" />
                  <img src={loading} alt="" className="w-full" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-[50vh] border-gray-300 shadow-lg border overflow-hidden rounded-xl">
          <div className="bg-gray-200 px-5 rounded-t-lg">
            <div className="flex justify-between place-items-center">
              <p className="font-semibold text-3xl font-mono">
                Selected Questions
              </p>
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
            </div>
            <div className="w-full rounded-full h-1 mx-auto bg-gray-400"></div>
          </div>
          <hr />
          <div className="h-[85%] bg-gray-100 rounded-b-lg pt-3 overflow-y-scroll">
            {selectedQuestions.length === 0 && (
              <div className="flex text-center justify-center place-items-center h-full">
                <p className="text-3xl font-semibold font-serif text-gray-600 justify-self-center place-self-center w-full">
                  Please Select A Question
                </p>
              </div>
            )}
            <div className="flex flex-col gap-y-1">
              {selectedQuestions.map((question) => (
                <div
                  key={question._id.$oid}
                  className="w-[93.5%] h-14 mx-auto flex items-center font-mono font-semibold text-xl place-items-center py-2 justify-between px-10 shadow-lg rounded-lg hover:scale-x-[103%] hover:shadow-md transition-all duration-300 bg-neutral-100 border border-gray-200"
                >
                  <p>{question.title}</p>
                  <button
                    onClick={() => handleRemoveQuestion(question)}
                    className="px-7 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {savingChanges && (
        <div className="absolute top-0 left-0 h-screen w-full flex justify-center place-items-center">
          <img
            src="https://i.pinimg.com/originals/2c/f9/0b/2cf90be1a5b8a7816e3107f58e0077b4.gif"
            alt=""
            className="opacity-20"
          />
        </div>
      )}
    </section>
  );
};

export default CreateContestAddQuestions;
