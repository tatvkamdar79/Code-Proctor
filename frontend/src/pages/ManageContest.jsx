import React, { useEffect, useState } from "react";
import AddQuestions from "../components/ContestComponents/AddQuestions";
import CalculationFormula from "../components/ContestComponents/CalculationFormula";
import Details from "../components/ContestComponents/Details";
import ContestNavbar from "../components/ContestComponents/ContestNavbar";
import Leaderboard from "../components/ContestComponents/Leaderboard";
import CreateGroup from "./CreateGroup";
import AddParticipants from "./AddParticipants";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config/config";
import Instructions from "../components/ContestComponents/Instructions";
import Notifications from "../components/ContestComponents/Notifications";

const ManageContest = () => {
  const { currentContestName } = useParams("currentContestName");
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
      });
  }, []);

  const notifications = Notifications({
    data: "kjfhkdjxchgjvyzhftg",
    contest: contest,
  });
  return (
    <div className="w-full lg:w-5/6 mx-auto">
      <ContestNavbar selection={selection} setSelection={setSelection} />
      {loading && (
        <div className="flex justify-center place-items-center absolute h-[80vh] w-[83vw] bg-white bg-opacity-50">
          <img
            src="https://cdn.dribbble.com/users/2014028/screenshots/4455123/opentime_from_png_20fps.gif"
            alt=""
            // className="invert"
          />
        </div>
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
      {selection === NOTIFICATIONS && notifications}
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
