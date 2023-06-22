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
import { useNavigate } from "react-router-dom";

const Leaderboard = ({ contest, setContest }) => {
  const navigate = useNavigate();
  const [questionNames, setQuestionNames] = useState({});
  const [questionTestCases, setQuestionTestCases] = useState({});
  const [suspiciousUsers, setSuspiciousUsers] = useState([]);

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

  const getSuspiciousUsers = async () => {
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    const data = {
      contestId: contest._id.$oid,
      authToken: jwt,
      route: "contests/getSuspiciousIps",
    };
    try {
      const response = await axios.post(baseURL, data);
      console.log("Suspicious Ips", response.data.data);
      setSuspiciousUsers(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getSuspiciousUsers();
  }, []);

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
      {/* <div className=""></div> */}
      <div className="max-h-[50vh] overflow-auto">
        <table className="table-auto w-full relative">
          <thead className="sticky -top-0.5">
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
                    <div className="flex justify-evenly">
                      {contestant.score}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

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

      <table className="table-auto my-10">
        <thead>
          <tr className="text-xl font-semibold text-center text-gray-600">
            <td className="border w-40 px-4 py-2">IP</td>
            <td className="border w-40 px-4 py-2">Users</td>
          </tr>
        </thead>
        <tbody>
          {suspiciousUsers &&
            Object.keys(suspiciousUsers).map((ip) => {
              return (
                <tr>
                  <td className="border px-4 py-2 text-lg font-semibold w-36">
                    {ip}
                  </td>
                  <td className="border px-4 py-2 font-serif font-semibold w-48">
                    <ol className="flex flex-col gap-y-1">
                      {suspiciousUsers[ip].map((user, index) => (
                        <li
                          key={index}
                          className="px-1 border py-1 rounded-lg bg-gray-100 cursor-pointer hover:scale-105 transition-all duration-300"
                        >
                          {user}
                        </li>
                      ))}
                    </ol>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* <div className="w-1/6 h-screen">
        {Object.keys(suspiciousUsers).map((ip) => {
          let susEmails = suspiciousUsers[ip];
          return susEmails.join(" ");
        })}
      </div> */}
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
