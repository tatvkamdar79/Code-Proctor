import React, { useEffect, useState } from "react";
import { BsCheck, BsX } from "react-icons/bs";
import { CSVLink } from "react-csv";
import IndividualContestProgressReport from "./IndividualContestProgressReport";

const data = [
  {
    name: "John Doe",
    email: "johndoe@example.com",
    questionsSolved: 8,
    totalTime: "2h 30m",
    submissionDetails: {
      correct: 6,
      incorrect: 2,
    },
  },
  {
    name: "John Doe",
    email: "johndoe@example.com",
    questionsSolved: 8,
    totalTime: "2h 30m",
    submissionDetails: {
      correct: 10,
      incorrect: 0,
    },
  },
  {
    name: "Jane Smith",
    email: "janesmith@example.com",
    questionsSolved: 12,
    totalTime: "3h 45m",
    submissionDetails: {
      correct: 9,
      incorrect: 3,
    },
  },
  // Add more dummy data rows here
];

const Leaderboard = () => {
  const [showIndividualReport, setShowIndividualReport] = useState(false);
  const [candidateData, setCandidateData] = useState({});
  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Questions Solved", key: "questionsSolved" },
    { label: "Total Time", key: "totalTime" },
    { label: "Correct Submissions", key: "correctSubmissions" },
    { label: "Incorrect Submissions", key: "incorrectSubmissions" },
  ];

  const csvData = data.map((row) => ({
    name: row.name,
    email: row.email,
    questionsSolved: row.questionsSolved,
    totalTime: row.totalTime,
    correctSubmissions: row.submissionDetails.correct,
    incorrectSubmissions: row.submissionDetails.incorrect,
  }));

  const csvReport = {
    filename:
      new Date().toLocaleDateString() +
      new Date().toLocaleTimeString() +
      "leaderboard.csv",
    headers: headers,
    data: csvData,
  };

  return (
    <section className="w-11/12 mx-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className="px-4 py-2 bg-green-500 text-white text-left border border-gray-200"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border w-40 px-4 py-2">{row.name}</td>
              <td
                className="border w-40 px-4 py-2 underline decoration-cyan-500 decoration-[2px] font-semibold text-gray-800 cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => {
                  setShowIndividualReport(true);
                  setCandidateData({
                    name: "John Doe",
                    email: "johndoe@example.com",
                    questionsSolved: 3,
                    totalTime: 9000000,
                    questions: [
                      {
                        questionName: "Fibonacci Series",
                        timeSpentOnQuestion: 1500000,
                        correctSubmissions: 2,
                        incorrectSubmissions: 1,
                        testCasesPassed: 3,
                        totalTestCases: 10,
                        code: "function fibonacci(n) {\n  if (n <= 1) {\n    return n;\n  }\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(5));",
                        codeExecutionTime: 10,
                        language: "javascript",
                      },
                      {
                        questionName: "Kadane's Algorithm",
                        timeSpentOnQuestion: 2000000,
                        correctSubmissions: 3,
                        incorrectSubmissions: 0,
                        testCasesPassed: 5,
                        totalTestCases: 10,
                        code: "function kadanesAlgorithm(arr) {\n  let maxSoFar = arr[0];\n  let maxEndingHere = arr[0];\n\n  for (let i = 1; i < arr.length; i++) {\n    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);\n    maxSoFar = Math.max(maxSoFar, maxEndingHere);\n  }\n\n  return maxSoFar;\n}\n\nconst arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];\nconsole.log(kadanesAlgorithm(arr));",
                        codeExecutionTime: 20,
                        language: "javascript",
                      },
                      {
                        questionName: "Reverse a String",
                        timeSpentOnQuestion: 1200000,
                        correctSubmissions: 2,
                        incorrectSubmissions: 0,
                        testCasesPassed: 4,
                        totalTestCases: 10,
                        code: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}\n\nconsole.log(reverseString('Hello, world!'));",
                        codeExecutionTime: 15,
                        language: "javascript",
                      },
                      {
                        questionName: "Check for Palindrome",
                        timeSpentOnQuestion: 2300000,
                        correctSubmissions: 1,
                        incorrectSubmissions: 1,
                        testCasesPassed: 2,
                        totalTestCases: 10,
                        code: "function isPalindrome(str) {\n  const reversed = str.split('').reverse().join('');\n  return str === reversed;\n}\n\nconsole.log(isPalindrome('madam'));",
                        codeExecutionTime: 10,
                        language: "javascript",
                      },
                    ],
                  });
                }}
              >
                {row.email}
              </td>
              <td className="border w-40 px-4 py-2">{row.questionsSolved}</td>
              <td className="border w-40 px-4 py-2">{row.totalTime}</td>
              <td className="border w-40 px-4 py-2">
                {row.submissionDetails.correct > 0 && (
                  <div className="flex place-items-center">
                    <BsCheck size={30} className="text-green-500" />
                    <span className="mr-2">
                      {row.submissionDetails.correct}
                    </span>
                  </div>
                )}
              </td>
              <td className="border px-4 py-2">
                {row.submissionDetails.incorrect >= 0 && (
                  <div className="flex place-items-center">
                    <BsX size={30} className="text-red-500" />
                    <span className="mr-2">
                      {row.submissionDetails.incorrect}
                    </span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-center">
        {/* TODO DATE CHANGE */}
        <CSVLink
          {...csvReport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to CSV
        </CSVLink>
      </div>
      {showIndividualReport && (
        <IndividualContestProgressReport
          setOpen={setShowIndividualReport}
          candidateData={candidateData}
        />
      )}
    </section>
  );
};

export default Leaderboard;
