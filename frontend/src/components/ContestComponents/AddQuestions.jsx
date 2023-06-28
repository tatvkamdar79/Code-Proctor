import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiSearchAlt, BiSearchAlt2 } from "react-icons/bi";
import { SiSketchfab } from "react-icons/si";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../../config/config";
import loading from "../../assets/addQuestionsLoading.gif";
import { MdOutlineAddCircle } from "react-icons/md";
import { getCookie } from "../../Hooks/useCookies";

const CreateContestAddQuestions = ({ contest, setContest }) => {
  const navigate = useNavigate();
  const { currentContestName } = useParams();
  const [selectedQuestions, setSelectedQuestions] = useState(contest.questions);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [problems, setProblems] = useState([]);
  const [changed, setChanged] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [searchByTags, setSearchByTags] = useState(false);

  useEffect(() => {
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    axios
      .post(baseURL, {
        authToken: jwt,
        route: "problems/getAllProblems",
      })
      .then((response) => {
        console.log(response.data.data.allProblems);
        setProblems(response.data.data.allProblems);
        setVisibleQuestions(response.data.data.allProblems);
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

  const saveChanges = async () => {
    if (!changed) {
      return;
    }

    setSavingChanges(true);

    let alreadySelectedQuestionsIds = contest.questions.map((q) => q._id.$oid);
    let newSelectedQuestionsIds = selectedQuestions.map((q) => q._id.$oid);
    console.log("alreadySelectedQuestionsIds", alreadySelectedQuestionsIds);
    console.log(newSelectedQuestionsIds);

    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    await axios
      .post(baseURL, {
        authToken: jwt,
        route: "contests/modifyQuestions",
        contestId: contest._id.$oid,
        updatedQuestions: newSelectedQuestionsIds,
      })
      .then((res) => {
        if (res.status === 200) {
          setSavingChanges(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setSavingChanges(false);
      });
    const data = {
      authToken: jwt,
      route: "contests/getContestDetails",
      contestName: currentContestName,
    };

    await axios
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
    if (query == "") {
      setSearchResults(visibleQuestions);
      return;
    }
    if (searchByTags) {
      const tags = query.split(",");
      for (let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].toLowerCase();
      }
      const results = visibleQuestions.filter((question) => {
        for (const tag of question.tags) {
          if (tags.indexOf(tag.toLowerCase()) != -1) {
            return true;
          }
        }
        return false;
      });
      setSearchResults(results);
    } else {
      const results = visibleQuestions.filter((question) =>
        question.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
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

  const handleDifficultyChange = (e) => {
    console.log(e.target.innerText);
    let newDifficulty;
    if (difficulty == e.target.innerText) {
      setDifficulty("");
    } else {
      setDifficulty(e.target.innerText);
    }
  };

  useEffect(() => {
    if (searchResults === null) {
      return;
    }
    if (difficulty == "") {
      setVisibleQuestions(problems);
      setSearchResults(problems);
    } else {
      let lowerCaseDifficulty = difficulty.toLowerCase();
      console.log(lowerCaseDifficulty);
      const newProblems = problems.filter(
        (problem) => problem.difficulty.toLowerCase() == lowerCaseDifficulty
      );
      setVisibleQuestions(newProblems);
      setSearchResults(newProblems);
    }
  }, [difficulty]);

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
          <div class="w-[90%] flex justify-between ml-9 mt-2">
            <div className="flex items-center space-x-4 w-1/2">
              <label class="flex items-center">
                <input type="button" class="hidden" />
                <button
                  class="py-2 px-4 rounded-md bg-green-500 text-white font-medium focus:bg-green-700 "
                  onClick={handleDifficultyChange}
                >
                  Easy
                </button>
              </label>
              <label class="flex items-center">
                <input type="button" class="hidden" />
                <button
                  class="py-2 px-4 rounded-md bg-orange-500 text-white font-medium focus:bg-orange-700 "
                  onClick={handleDifficultyChange}
                >
                  Medium
                </button>
              </label>
              <label class="flex items-center">
                <input type="button" class="hidden" />
                <button
                  class="py-2 px-4 rounded-md bg-red-500 text-white font-medium focus:bg-red-700 "
                  onClick={handleDifficultyChange}
                >
                  Hard
                </button>
              </label>
            </div>
            <div className="flex">
              <label class="flex">
                <input type="button" class="hidden" />
                <button
                  class={`py-2 px-4 rounded-md ${
                    searchByTags ? "bg-green-600" : "bg-green-500"
                  } text-white font-medium`}
                  onClick={(e) => setSearchByTags(!searchByTags)}
                >
                  Search by tags?
                </button>
              </label>
            </div>
          </div>

          <div className="flex w-full justify-end pb-2 h-[35.5vh]">
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
        <div className="w-full h-[55vh] border-gray-300 shadow-lg border overflow-hidden rounded-xl">
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
