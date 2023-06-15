import React, { useEffect, useState } from "react";
import { BsCheck, BsX } from "react-icons/bs";
import { CSVLink } from "react-csv";
import IndividualContestProgressReport from "./IndividualContestProgressReport";
import axios from "axios";
import { baseURL } from "../../config/config";
import leaderboardLoading from "../../assets/leaderboardLoading1.gif";
import {
  questionsAttempted,
  totalTimeTaken,
  correctSubmissions,
  incorrectSubmissions,
  getContestantScore,
} from "./LeaderboardHelper";
import { getCookie } from "../../Hooks/useCookies";

const Leaderboard = ({ contest, setContest }) => {
  const [questionNames, setQuestionNames] = useState({});
  const [questionTestCases, setQuestionTestCases] = useState({});

  const [submissions, setSubmissions] = useState(null);
  const [
    individualSubmissionCandidateDetails,
    setIndividualSubmissionCandidateDetails,
  ] = useState([]);

  useEffect(() => {
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    console.log("Contest is", contest);
    let tempQuestions = {},
      tempTCs = {};
    for (let question of contest.questions) {
      tempQuestions[question._id.$oid] = question.title;
      tempTCs[question._id.$oid] = question.hiddenTCs.length;
    }
    console.log("Questions are", tempQuestions);
    setQuestionNames(tempQuestions);
    setQuestionTestCases(tempTCs);
    const data = {
      contestId: contest._id.$oid,
      authToken: jwt,
      route: "contests/getSubmissions",
    };
    axios.post(baseURL, data).then((response) => {
      console.log(response.data.data);
      getSubmissionsTableFormat(response.data.data);
    });
  }, []);

  const getSubmissionsTableFormat = (submissionDetails) => {
    setIndividualSubmissionCandidateDetails(submissionDetails);
    let leaderboardData = [];
    for (let i = 0; i < submissionDetails.length; i++) {
      let temp = {
        email: submissionDetails[i].contestantEmail,
        questionsAttempted: questionsAttempted(submissionDetails[i], contest),
        totalTime: totalTimeTaken(submissionDetails[i], contest),
        correctSubmissions: correctSubmissions(submissionDetails[i], contest),
        incorrectSubmissions: incorrectSubmissions(
          submissionDetails[i],
          contest
        ),
        score: getContestantScore(submissionDetails[i], contest),
        indexInSubmissionsDetails: i,
      };
      console.log("temp", temp);
      leaderboardData.push(temp);
    }
    leaderboardData.sort((contestant1, contestant2) => {
      return contestant2.score - contestant1.score;
    });
    setSubmissions(leaderboardData);
  };

  const [showIndividualReport, setShowIndividualReport] = useState(false);
  const [candidateData, setCandidateData] = useState({});
  const [candidateEmail, setCandidateEmail] = useState("");

  const headers = [
    { label: "Email", key: "email1" },
    { label: "Email", key: "email2" },
    { label: "Questions Attempted", key: "questionsAttempted" },
    { label: "Total Time", key: "totalTime" },
    { label: "Correct Submissions", key: "correctSubmissions" },
    { label: "Incorrect Submissions", key: "incorrectSubmissions" },
    { label: "Score", key: "score" },
  ];

  const csvData = submissions;
  // .map((row) => ({
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
    <section className="w-11/12 mx-auto">
      {submissions === null && (
        <div className="w-full absolute left-0">
          <div className="flex w-5/6 mx-auto justify-evenly mt-16">
            <img src={leaderboardLoading} alt="Loading..." />
            <img src={leaderboardLoading} alt="Loading..." />
            <img src={leaderboardLoading} alt="Loading..." />
            <img src={leaderboardLoading} alt="Loading..." />
          </div>
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
                    console.log("Contestant clicked", contestant);
                    setShowIndividualReport(true);
                    let myQuestions = [];
                    console.log(
                      individualSubmissionCandidateDetails[
                        contestant.indexInSubmissionsDetails
                      ]
                    );

                    let dataToDisplay = [];
                    let totalTimeTaken = 0;

                    for (let [questionId, details] of Object.entries(
                      individualSubmissionCandidateDetails[
                        contestant.indexInSubmissionsDetails
                      ].submissions
                    )) {
                      let newSubmissionItem = {
                        questionName: questionNames[questionId],
                        timeSpentOnQuestion: details.timeSpentOnQuestion,
                        code: details.code,
                        codeExecutionTime: details.executionTime * 1000,
                        correctSubmissions: details.correctSubmissions,
                        incorrectSubmissions: details.incorrectSubmissions,
                        totalTestCases: questionTestCases[questionId],
                        language: details.language,
                        testCasesPassed: details.submissionStatus.reduce(
                          (total, x) => (x == "Correct" ? total + 1 : total),
                          0
                        ),
                      };
                      totalTimeTaken += details.timeSpentOnQuestion;
                      dataToDisplay.push(newSubmissionItem);
                    }

                    console.log("New data to display", dataToDisplay);

                    console.log(questionNames);
                    setCandidateEmail(contestant.email);
                    setCandidateData({
                      name: contestant.email,
                      email: contestant.email,
                      questionsSolved: contestant.correctSubmissions,
                      totalTime: totalTimeTaken,
                      questions: dataToDisplay,
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
