import React, { useEffect, useState } from "react";
import AddQuestions from "../components/ContestComponents/AddQuestions";
import CalculationFormula from "../components/ContestComponents/CalculationFormula";
import Details from "../components/ContestComponents/Details";
import ContestNavbar from "../components/ContestComponents/ContestNavbar";
import Leaderboard from "../components/ContestComponents/Leaderboard";
import CreateGroup from "./CreateGroup";
import AddParticipants from "./AddParticipants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config/config";
import Instructions from "../components/ContestComponents/Instructions";
import Notifications from "../components/ContestComponents/Notifications";
import ContestInfo from "../components/ContestComponents/ContestInfo";
import contestDetailsLoading from "../assets/contestDetailsLoading.gif";
import contestDoesNotExistGif from "../assets/contestDoesNotExist.gif";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { getCookie } from "../Hooks/useCookies";

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
  const [showFirstTimePopup, setShowFirstTimePopup] = useState(false);
  const [closeShowFirstTimePopup, setCloseShowFirstTimePopup] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const { state } = useLocation();
  console.log("state", state);

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
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    const data = {
      authToken: jwt,
      route: "contests/getContestDetails",
      contestName: currentContestName,
    };
    axios
      .post(baseURL, data)
      .then((response) => {
        console.log(response, response.data.status);
        if (response.data.status !== 200) {
          setLoading(false);
          setContestDoesNotExist(true);
          return;
        }
        // if(response.data.data.status)
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

    console.log(state);
    if (state && state?.newContest && state.newContest) {
      setTimeout(() => {
        setShowFirstTimePopup(true);
      }, 1500);
    }
  }, []);
  useEffect(() => {
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    if (contest !== null) {
      const data = {
        authToken: jwt,
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
    <div className="w-full lg:w-5/6 mx-auto overflow-hidden">
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

      {selection !== DETAILS && (
        <ContestInfo
          contest={contest}
          sendingEmail={sendingEmail}
          setSendingEmail={setSendingEmail}
        />
      )}

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
          sendingEmail={sendingEmail}
          setSendingEmail={setSendingEmail}
        />
      )}
      {contest && selection === LEADERBOARD && (
        <Leaderboard contest={contest} setContest={setContest} />
      )}
      {contest && selection === ADD_PARTICIPANTS && (
        <AddParticipants contest={contest} setContest={setContest} />
      )}

      {state &&
        state?.newContest &&
        state.newContest &&
        !closeShowFirstTimePopup && (
          <div
            className={`absolute min-w-80 h- right-[8.4%] top-[17vh] bg-gray-200 bg-opacity-30 border border-gray-400 rounded-md p-2 opacity-80 ${
              showFirstTimePopup
                ? "translate-x-0 scale-105"
                : "translate-x-[570px] scale-0"
            } transition-all duration-[1000ms] ease-in-out`}
          >
            <AiOutlineCloseCircle
              size={20}
              className="absolute left-0.5 top-0.5 cursor-pointer text-red-600"
              onClick={() => {
                setShowFirstTimePopup(false);
                setTimeout(() => {
                  setCloseShowFirstTimePopup(true);
                }, 1000);
              }}
            />
            <p className="text-lg font-mono font-semibold pr-7 pl-7 text-green-600">
              Welcome to managing a new contest
            </p>
            <p className="text-sm font-mono font-semibold pr-7 pl-7 text-green-600">
              Would you like to add participants?
            </p>
            <button
              onClick={() => {
                setSelection(ADD_PARTICIPANTS);
                setShowFirstTimePopup(false);
                setTimeout(() => {
                  setCloseShowFirstTimePopup(true);
                }, 1000);
              }}
              className="bg-cyan-600 text-white shadow-md shadow-gray-300 ml-7 my-1 px-3 py-1 rounded-md"
            >
              Add Participants
            </button>
          </div>
        )}
    </div>
  );
};

export default ManageContest;
