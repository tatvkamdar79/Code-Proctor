import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDragHandle } from "react-icons/md";
import { useParams } from "react-router-dom";
import { baseURL } from "../../config/config";
import sendingEmailGif from "../../assets/sendingEmail.gif";

const ContestInfo = ({ contest, sendingEmail, setContest }) => {
  const { currentContestName } = useParams();
  const [contestName, setContestName] = useState(contest?.contestName || "");
  const [questions, setQuestions] = useState(contest?.questions?.length || 0);
  const [contestants, setContestants] = useState(
    contest?.contestants?.length || 0
  );
  const [startDate, setStartDate] = useState(
    new Date(contest?.contestStartDate?.sec * 1000).toLocaleString() || ""
  );
  const [endDate, setEndDate] = useState(
    new Date(contest?.contestEndDate?.sec * 1000).toLocaleString() || ""
  );
  useEffect(() => {
    console.log("Contest Changed");
    console.log(contest);
    console.log("Contest Changed");
    setContestName(contest?.contestName);
    setQuestions(contest?.questions.length);
    setContestants(contest?.contestants.length);
    setStartDate(
      new Date(contest?.contestStartDate?.sec * 1000).toLocaleString()
    );
    setEndDate(new Date(contest?.contestEndDate?.sec * 1000).toLocaleString());
  }, [contest]);

  return (
    <div className="flex justify-between place-items-center px-5 border border-gray-300 rounded-full bg-green-600 text-white mb-3">
      <div className="flex gap-x-1">
        <p className="font-semibold text-xl font-mono">Contest Name:</p>
        <p className="font-semibold text-xl font-mono">{contestName}</p>
      </div>
      <MdDragHandle size={30} className="rotate-90 text-gray-600" />
      <div className="flex gap-x-1">
        <p className="font-semibold text-xl font-mono">Questions:</p>
        <p className="font-semibold text-xl font-mono">{questions}</p>
      </div>
      <MdDragHandle size={30} className="rotate-90 text-gray-600" />
      <div className="flex gap-x-1">
        <p className="font-semibold text-xl font-mono">Contestants:</p>
        <p className="font-semibold text-xl font-mono">{contestants}</p>
      </div>
      <MdDragHandle size={30} className="rotate-90 text-gray-600" />
      <div className="flex gap-x-1">
        <p className="font-semibold text-xl font-mono">From: </p>
        <p className="font-semibold text-xl font-mono">{startDate}</p>
      </div>
      <MdDragHandle size={30} className="rotate-90 text-gray-600" />
      <div className="flex gap-x-1">
        <p className="font-semibold text-xl font-mono">End:</p>
        <p className="font-semibold text-xl font-mono">{endDate}</p>
      </div>
      <div
        className={`flex place-items-center justify-center ${
          sendingEmail ? "w-40" : "w-0"
        }  transition-all duration-700`}
      >
        <MdDragHandle size={30} className="rotate-90 text-gray-600" />
        <div className="flex h-7 place-items-center overflow-hidden px-5">
          <img
            src={sendingEmailGif}
            alt=""
            className="bg-green-600 rounded-full h-16"
          />
        </div>
      </div>
    </div>
  );
};

export default ContestInfo;
