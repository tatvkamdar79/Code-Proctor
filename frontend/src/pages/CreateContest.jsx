import React, { useState } from "react";
import AddQuestions from "../components/ContestComponents/AddQuestions";
import CalculationFormula from "../components/ContestComponents/CalculationFormula";
import Details from "../components/ContestComponents/Details";
import ContestNavbar from "../components/ContestComponents/ContestNavbar";

const CreateContest = () => {
  const DETAILS = "DETAILS";
  const QUESTIONS = "QUESTIONS";
  const CALCULATION_FORMULA = "CALCULATION_FORMULA";
  const NOTIFICATIONS = "NOTIFICATIONS";
  const ADD_PARTICIPANTS = "ADD_PARTICIPANTS";

  const [selection, setSelection] = useState(DETAILS);
  const [contestName, setContestName] = useState("");
  const [eventType, setEventType] = useState("FUN");
  const [companyName, setCompanyName] = useState("DARWINBOX");

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

  return (
    <div className="w-full lg:w-5/6 mx-auto">
      <section className="w-11/12 mx-auto">
        <p className="text-gray-500 font-semibold">
          {"www.blablabla.com/test/" + contestName}
        </p>
      </section>

      <ContestNavbar selection={selection} setSelection={setSelection} />

      {selection === DETAILS && <Details />}

      {selection === QUESTIONS && <AddQuestions />}

      {selection === CALCULATION_FORMULA && <CalculationFormula />}
    </div>
  );
};

export default CreateContest;
