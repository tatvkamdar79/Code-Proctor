import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import loading from "../assets/addQuestionsLoading.gif";
import { baseURL } from "../config/config";

const AllQuestions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [problems, setProblems] = useState([]);
  const [viewProblem, setViewProblem] = useState(null);

  useEffect(() => {
    axios
      .post(baseURL, {
        authToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1Mzk1OTl9.wyOmQgp8FpwzjxU7Ih0e29d8RotSxtPgDTQkRy5tr3Q",
        route: "problems/getAllProblems",
      })
      .then((response) => {
        console.log("ljhkjh");
        console.log(response.data.data.allProblems);
        setProblems(response.data.data.allProblems);
        setSearchResults(response.data.data.allProblems);
        setViewProblem(response.data.data.allProblems[0]);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleSearch = (query) => {
    const results = problems.filter((question) =>
      question.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };
  return (
    <div className="w-full h-[92.5vh]">
      <div className="flex w-11/12 h-full mx-auto border">
        <div
          className={`pt-5 w-1/2 h-full flex flex-col justify-center place-items-center border-r-2 border-gray-400 bg-gray-50 px-5`}
        >
          <p className="text-3xl font-semibold font-mono">All Questions</p>
          <div className="w-full flex place-items-center justify-evenly">
            <BiSearchAlt size={40} className="w-1/12" />
            <input
              type="text"
              value={searchQuery}
              id="searchBar"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search challenges..."
              className="w-11/12 mx-auto px-4 py-2 border-2 border-gray-400 rounded-md outline-green-600"
            />
          </div>
          <div className="flex w-full h-full justify-center overflow-y-scroll">
            <div
              className={`w-full h-full mt-3.5 justify-self-end bg-gray-100 px-4 border border-t-0 border-gray-300 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']`}
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
                      onClick={() => {
                        setViewProblem(question);
                      }}
                      className={`w-28 py-1 text-sm font-semibold text-white rounded-md transition-all duration-300 ${
                        viewProblem !== null &&
                        viewProblem?._id?.$oid === question?._id?.$oid
                          ? "bg-green-600 opacity-50"
                          : "bg-cyan-500 hover:bg-cyan-600"
                      }`}
                      disabled={viewProblem?._id?.$oid === question?._id?.$oid}
                    >
                      {viewProblem !== null &&
                      viewProblem?._id?.$oid === question?._id?.$oid
                        ? "Viewing"
                        : "View"}
                    </button>
                  </div>
                ))
              ) : (
                <div className="w-full mx-auto h-full grid grid-cols-2">
                  <img src={loading} alt="" className="w-full" />
                  <img src={loading} alt="" className="w-full" />
                  <img src={loading} alt="" className="w-full" />
                  <img src={loading} alt="" className="w-full" />
                  <img src={loading} alt="" className="w-full" />
                  <img src={loading} alt="" className="w-full" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-1/2 bg-gray-100">
          {!searchResults && (
            <p className="w-full font-semibold text-center text-4xl font-mono place-items-center place-self-center">
              Loading Questions...
            </p>
          )}
          {searchResults && viewProblem === null && (
            <p className="w-full font-semibold text-center text-4xl font-mono place-items-center place-self-center text-gray-600">
              Click on view to pre-view a question
            </p>
          )}
          {viewProblem !== null && <ViewQuestion question={viewProblem} />}
        </div>
      </div>
    </div>
  );
};

const ViewQuestion = ({ question }) => {
  return (
    <div
      className="h-full w-full pt-5 flex flex-col px-3 bg-[#f3f7f7] gap-y-7 overflow-y-scroll"
      id="question"
    >
      <section>
        <p className="text-3xl text-gray-800 font-semibold border-b-2 border-gray-300 pb-3 mb-5">
          {question.title}
        </p>
      </section>

      <section>
        <p className="font-normal text-gray-500">{question.description}</p>
      </section>

      <section>
        <p className="text-xl font-semibold text-gray-800">Constraints :</p>
        <ul className="flex flex-col gap-y-1 italic pl-8 text-gray-600 list-disc">
          {/* TODO Check error */}
          {question?.constraints
            ? question.constraints.map((constraint, index) => {
                {
                  return React.createElement("li", {
                    dangerouslySetInnerHTML: { __html: constraint },
                    key: index,
                  });
                }
              })
            : "No constraints"}
        </ul>
      </section>

      <section className="flex flex-col gap-y-8 text-gray-800">
        {question.sampleTCs.map(({ input, output }, index) => (
          <div
            key={index}
            className="flex flex-col gap-y-2 border-b border-gray-400 pb-4"
          >
            <p className="text-lg font-medium">Sample Input {index + 1} :</p>
            <div className="mx-10 bg-white p-4 shadow-sm text-gray-800">
              {input.split("\n").map((line, innerIndex) => (
                <p key={innerIndex}>{line}</p>
              ))}
            </div>
            <p className="text-lg font-medium">Sample Output {index + 1} :</p>
            <div className="mx-10 bg-white p-4 shadow-sm text-gray-800">
              <p>{output}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AllQuestions;
