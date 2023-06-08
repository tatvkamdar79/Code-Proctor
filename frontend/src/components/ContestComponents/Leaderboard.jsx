import React, { useEffect, useState } from "react";
import { BsCheck, BsX } from "react-icons/bs";
import { CSVLink } from "react-csv";
import IndividualContestProgressReport from "./IndividualContestProgressReport";
import axios from "axios";
import { baseURL } from "../../config/config";
import leaderboardLoading from "../../assets/leaderboardLoading1.gif";

const Leaderboard = ({ contest, setContest }) => {
  let totalScore = 0;
  for (let question of contest.questions) {
    totalScore += question.score;
  }
  const [submissions, setSubmissions] = useState(null);
  useEffect(() => {
    const data = {
      contestId: contest._id.$oid,
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1MjE1ODV9.3-O-JVP8eaYRPtXo0q8pTDc3HY3sN91PXDGPmrbqsDo",
      route: "contests/getSubmissions",
    };
    axios.post(baseURL, data).then((response) => {
      console.log(response.data.data);
      getSubmissionsTableFormat(response.data.data);
    });
  }, []);

  const questionsAttempted = (submissionDetails) => {
    const submissionKeys = Object.keys(submissionDetails.submissions);

    const count = submissionKeys.reduce((accumulator, currentKey) => {
      const { correctSubmissions, incorrectSubmissions } =
        submissionDetails.submissions[currentKey];
      const hasSubmissions = correctSubmissions > 0 || incorrectSubmissions > 0;
      return accumulator + (hasSubmissions ? 1 : 0);
    }, 0);

    return count;
  };

  const totalTimeTaken = (submissionDetails) => {
    const timeSpentValues = Object.keys(submissionDetails.submissions).map(
      (q) => {
        return submissionDetails.submissions[q]["timeSpentOnQuestion"];
      }
    );

    const totalTime = timeSpentValues.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    const totalMilliseconds = totalTime;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${hours} : ${minutes} : ${seconds}`;
  };

  const correctSubmissions = (submissionDetails) => {
    const submissionKeys = Object.keys(submissionDetails.submissions);

    const correctSubmissionsCount = submissionKeys.map((q) => {
      return submissionDetails.submissions[q]["correctSubmissions"] > 0 ? 1 : 0;
    });

    const totalCorrectSubmissions = correctSubmissionsCount.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue;
      },
      0
    );

    return totalCorrectSubmissions;
  };

  const incorrectSubmissions = (submissionDetails) => {
    const submissionKeys = Object.keys(submissionDetails.submissions);

    const incorrectSubmissionsCount = submissionKeys.map((q) => {
      return submissionDetails.submissions[q]["incorrectSubmissions"] > 0
        ? 1
        : 0;
    });

    const totalIncorrectSubmissions = incorrectSubmissionsCount.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue;
      },
      0
    );

    return totalIncorrectSubmissions;
  };

  const getContestantScore = (submissionDetails) => {
    return Math.round(
      (Object.keys(submissionDetails.submissions)
        .map((q) => {
          console.log(q);
          if (submissionDetails.submissions[q]["correctSubmissions"] > 0) {
            console.log(
              q,
              "=> ",
              submissionDetails.submissions[q]["correctSubmissions"] > 0
            );
            return contest.questions.filter(
              (question) => question._id.$oid === q
            )[0].score;
          }
          return 0;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0) /
        totalScore) *
        100
    );
  };

  const getSubmissionsTableFormat = (submissionDetails) => {
    let leaderboardData = [];
    for (let i = 0; i < submissionDetails.length; i++) {
      let temp = {
        email: submissionDetails[i].contestantEmail,
        questionsAttempted: questionsAttempted(submissionDetails[i]),
        totalTime: totalTimeTaken(submissionDetails[i]),
        correctSubmissions: correctSubmissions(submissionDetails[i]),
        incorrectSubmissions: incorrectSubmissions(submissionDetails[i]),
        score: getContestantScore(submissionDetails[i]),
      };
      console.log("temp", temp);
      leaderboardData.push(temp);
    }
    setSubmissions(leaderboardData);
  };

  const [showIndividualReport, setShowIndividualReport] = useState(false);
  const [candidateData, setCandidateData] = useState({});
  const headers = [
    { label: "Email", key: "email1" },
    { label: "Email", key: "email2" },
    { label: "Questions Attempted", key: "questionsAttempted" },
    { label: "Total Time", key: "totalTime" },
    { label: "Correct Submissions", key: "correctSubmissions" },
    { label: "Incorrect Submissions", key: "incorrectSubmissions" },
    { label: "Score", key: "score" },
  ];

  const csvData = [];

  // const csvData = data.map((row) => ({
  //   name: row.name,
  //   email: row.email,
  //   questionsSolved: row.questionsSolved,
  //   totalTime: row.totalTime,
  //   correctSubmissions: row.submissionDetails.correct,
  //   incorrectSubmissions: row.submissionDetails.incorrect,
  // }));

  const csvReport = {
    filename:
      new Date().toLocaleDateString() +
      new Date().toLocaleTimeString() +
      "leaderboard.csv",
    headers: headers,
    data: csvData,
  };

  return (
    <section className="w-11/12 mx-auto relative">
      {submissions === null && (
        <div className="w-full flex justify-between place-items-center absolute opacity-50 top-16">
          <img src={leaderboardLoading} alt="Loading..." />
          <img src={leaderboardLoading} alt="Loading..." />
          <img src={leaderboardLoading} alt="Loading..." />
        </div>
      )}
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
          {submissions &&
            submissions.map((contestant, index) => (
              <tr key={index}>
                <td className="border w-40 px-4 py-2">{contestant.email}</td>
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
                  {contestant.email}
                </td>
                <td className="border w-40 px-4 py-2">
                  {contestant.questionsAttempted}
                </td>
                <td className="w-40 border px-4 py-2">
                  {contestant.totalTime}
                </td>
                <td className="w-40 border px-4 py-2">
                  <div className="flex justify-evenly">
                    {contestant.correctSubmissions}
                    <BsCheck size={30} className="inline text-green-500" />
                  </div>
                </td>
                <td className="w-40 border px-4 py-2">
                  <div className="flex justify-evenly">
                    {contestant.incorrectSubmissions}
                    <BsX size={30} className="text-red-500 inline" />
                  </div>
                </td>
                <td className="w-40 border px-4 py-2">
                  <div className="flex justify-evenly">{contestant.score}</div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-4 text-center">
        {/* TODO DATE CHANGE */}
        {submissions !== null && (
          <CSVLink
            {...csvReport}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Export to CSV
          </CSVLink>
        )}
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
