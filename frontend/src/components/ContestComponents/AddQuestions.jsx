import React, { useState } from "react";
import { BiSearchAlt, BiSearchAlt2 } from "react-icons/bi";

const CreateContestAddQuestions = () => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const questions = [
    { id: 1, content: "Question 1" },
    { id: 2, content: "Question 2" },
    { id: 3, content: "Question 3" },
    { id: 4, content: "Question 4" },
    { id: 5, content: "Question 5" },
    { id: 6, content: "Question 6" },
    { id: 7, content: "Question 7" },
  ];

  const handleSearch = (query) => {
    const results = questions.filter((question) =>
      question.content.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddQuestion = (question) => {
    const isQuestionSelected = selectedQuestions.some(
      (selectedQuestion) => selectedQuestion.id === question.id
    );

    if (!isQuestionSelected) {
      setSelectedQuestions((prevQuestions) => [...prevQuestions, question]);
    }
  };

  const handleRemoveQuestion = (question) => {
    setSelectedQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== question.id)
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
                key={question.id}
                className="h-14 flex items-center justify-between px-4 py-2 mt-2 border border-gray-400 bg-white rounded-md relative"
              >
                <p className="font-mono font-medium text-md overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  {question.content}
                </p>
                <button
                  onClick={() => handleAddQuestion(question)}
                  disabled={selectedQuestions.some(
                    (selectedQuestion) => selectedQuestion.id === question.id
                  )}
                  className={`px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 ${
                    selectedQuestions.some(
                      (selectedQuestion) => selectedQuestion.id === question.id
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
            key={question.id}
            className="flex items-center font-mono font-semibold text-xl place-items-center py-2 justify-between px-10 border-b border-gray-400"
          >
            <p>{question.content}</p>
            <button
              onClick={() => handleRemoveQuestion(question)}
              className="px-14 py-3 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CreateContestAddQuestions;
