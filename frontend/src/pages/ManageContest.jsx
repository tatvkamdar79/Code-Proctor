import React, { useEffect, useState } from "react";
import AddQuestions from "../components/ContestComponents/AddQuestions";
import CalculationFormula from "../components/ContestComponents/CalculationFormula";
import Details from "../components/ContestComponents/Details";
import ContestNavbar from "../components/ContestComponents/ContestNavbar";
import Leaderboard from "../components/ContestComponents/Leaderboard";
import CreateGroup from "./CreateGroup";
import AddParticipants from "./AddParticipants";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config/config";
import Instructions from "../components/ContestComponents/Instructions";
import Notifications from "../components/ContestComponents/Notifications";
import ContestInfo from "../components/ContestComponents/ContestInfo";
import contestDetailsLoading from "../assets/contestDetailsLoading.gif";
import contestDoesNotExistGif from "../assets/contestDoesNotExist.gif";

const ManageContest = () => {
  const { currentContestName } = useParams("currentContestName");
  const navigate = useNavigate();
  const DETAILS = "DETAILS";
  const QUESTIONS = "QUESTIONS";
  const CALCULATION_FORMULA = "CALCULATION_FORMULA";
  const LEADERBOARD = "LEADERBOARD";
  const NOTIFICATIONS = "NOTIFICATIONS";
  const ADD_PARTICIPANTS = "ADD_PARTICIPANTS";

  const [contest, setContest] = useState(null);
  const [selection, setSelection] = useState(DETAILS);
  const [contestName, setContestName] = useState(currentContestName);
  const [eventType, setEventType] = useState("FUN");
  const [companyName, setCompanyName] = useState("DARWINBOX");
  const [loading, setLoading] = useState(true);
  const [contestDoesNotExist, setContestDoesNotExist] = useState(false);
  const [emailLogs, setEmailLogs] = useState(null);
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform any necessary actions with the form data
    console.log("Submitted data:", {
      contestName,
      eventType,
      companyName,
    });

    // Reset the form fields
    setContestName("");
    setEventType("FUN");
    setCompanyName("DARWINBOX");
  };

  useEffect(() => {
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
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setContestDoesNotExist(true);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (contest !== null) {
      const data = {
        authToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1MjE1ODV9.3-O-JVP8eaYRPtXo0q8pTDc3HY3sN91PXDGPmrbqsDo",
        route: "contests/fetchEmailLogs",
        contestId: contest._id.$oid,
      };
      axios.post(baseURL, data).then((response) => {
        console.log("THis is response of emails");
        console.log(response.data.data);
        setEmailLogs(response.data.data);
      });
    }
  }, [contest]);

  const [correctedContestName, setCorrectedContestName] =
    useState(currentContestName);
  return (
    <div className="w-full lg:w-5/6 mx-auto">
      {contestDoesNotExist && (
        <div className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col justify-center place-items-center gap-y-2">
          <p className="font-semibold font-mono text-3xl text-gray-800">
            Oops! No contest with "{currentContestName}" exists!
          </p>
          <p className="font-semibold font-mono text-3xl text-gray-700">
            Made a typo ?
          </p>
          <div className="flex gap-x-4 place-items-center">
            <p className="font-semibold text-2xl font-mono text-gray-600">
              Corrected Contest Name
            </p>
            <input
              autoFocus
              type="text"
              name=""
              id=""
              className="font-semibold px-2 py-1 border-2 border-cyan-600 outline-none focus:border-green-500 rounded-lg transition-all duration-300"
              value={correctedContestName}
              onChange={(e) => setCorrectedContestName(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-1 font-semibold font-mono bg-green-500 hover:bg-green-600 hover:scale-105 transition-all duration-300 text-white rounded-lg"
            onClick={() =>
              (window.location.href = `/contest/manage/${correctedContestName}`)
            }
          >
            Go to Contest
          </button>
          <img src={contestDoesNotExistGif} alt="" />
        </div>
      )}

      <ContestNavbar selection={selection} setSelection={setSelection} />
      {loading && (
        <div className="flex justify-center place-items-center absolute h-[80vh] w-[83vw] bg-white bg-opacity-50">
          <img
            src={contestDetailsLoading}
            alt=""
            // className="invert"
          />
        </div>
      )}

      {selection !== DETAILS && <ContestInfo contest={contest} />}

      {selection === DETAILS && (
        <Details contest={contest} setContest={setContest} />
      )}

      {contest && selection === QUESTIONS && (
        <AddQuestions contest={contest} setContest={setContest} />
      )}

      {contest && selection === CALCULATION_FORMULA && (
        <CalculationFormula contest={contest} setContest={setContest} />
      )}

      {selection === NOTIFICATIONS && (
        <Notifications
          contest={contest}
          emailLogs={emailLogs}
          setEmailLogs={setEmailLogs}
          body={body}
          setBody={setBody}
          subject={subject}
          setSubject={setSubject}
        />
      )}
      {contest && selection === LEADERBOARD && (
        <Leaderboard contest={contest} setContest={setContest} />
      )}
      {contest && selection === ADD_PARTICIPANTS && (
        <AddParticipants contest={contest} setContest={setContest} />
      )}
    </div>
  );
};

export default ManageContest;
