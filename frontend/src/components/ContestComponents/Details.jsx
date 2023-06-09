import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../../config/config";
import Instructions from "./Instructions";

const CreateChallangeDetails = ({ contest, setContest }) => {
  const navigate = useNavigate();
  const [contestName, setContestName] = useState(contest?.contestName || "");
  const [eventType, setEventType] = useState(contest?.eventType || "");
  const [companyName, setCompanyName] = useState(contest?.companyName || "");
  const [contestStartDate, setContestStartDate] = useState(
    contest?.contestStartDate || ""
  );
  const [startTime, setStartTime] = useState(contest?.startTime || "");
  const [contestEndDate, setContestEndDate] = useState(
    contest?.contestEndDate || ""
  );
  const [endTime, setEndTime] = useState(contest?.endTime || "");
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [instructions, setInstructions] = useState(contest?.instructions || "");
  const [instructionsTitle, setInstructionsTitle] = useState(
    contest?.instructionsTitle || ""
  );

  useEffect(() => {
    setContestName(contest?.contestName);
    setEventType(contest?.eventType);
    setCompanyName(contest?.companyName);
    setStartTime(contest?.startTime);
    setContestEndDate(contest?.contestEndDate);
    setEndTime(contest?.endTime);
    setInstructionsTitle(contest?.instructionsTitle);
    setInstructions(contest?.instructions);
    const startingDate = new Date(
      contest?.contestStartDate.sec * 1000
    ).toLocaleString();
    const endingDate = new Date(
      contest?.contestEndDate.sec * 1000
    ).toLocaleString();
    if (contest) {
      setContestStartDate(convertDateFormat(startingDate.slice(0, 10)));
      setContestEndDate(convertDateFormat(endingDate.slice(0, 10)));
      setStartTime(
        new Date(contest?.contestStartDate.sec * 1000)
          .toUTCString()
          .slice(17, 22)
      );
      setEndTime(
        new Date(contest?.contestEndDate.sec * 1000).toUTCString().slice(17, 22)
      );
    }
  }, [contest]);

  const possibleTimes = [
    "00:00",
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    "06:00",
    "06:15",
    "06:30",
    "06:45",
    "07:00",
    "07:15",
    "07:30",
    "07:45",
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
    "15:45",
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
    "20:15",
    "20:30",
    "20:45",
    "21:00",
    "21:15",
    "21:30",
    "21:45",
    "22:00",
    "22:15",
    "22:30",
    "22:45",
    "23:00",
    "23:15",
    "23:30",
    "23:45",
  ];

  const handleGetStarted = () => {
    if (true) {
      navigate("/contest/manage/a");
    }
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // const formattedDate = currentDate.toLocaleString(undefined, options);

  const convertDateFormat = (dateString) => {
    const parts = dateString.split("/"); // Split the date string into parts
    // console.log("Parts is", parts);
    // Rearrange the parts in the desired order (yyyy-mm-dd)
    const year = parts[2].split(",")[0];
    const formattedDate = `${year}-${parts[1]}-${parts[0]}`;
    // console.log(formattedDate);
    return formattedDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT");
    // console.log(contestStartDate, date);
    const d1 = contestStartDate.split("-");
    const d2 = contestEndDate.split("-");
    console.log(d1, d2);
    let isDateCorrect = 1,
      greater = 0;
    for (let i = 0; i < 3; i++) {
      console.log(greater);
      console.log(Number(d1[i]), Number(d2[i]));
      if (Number(d2[i]) < Number(d1[i]) && greater == 0) {
        // alert("Please enter a valid date");
        isDateCorrect = 0;
      } else if (Number(d2[i]) > Number(d1[i])) {
        greater = 1;
      }
    }
    const time1 = startTime.split(":");
    const time2 = endTime.split(":");
    let isTimeCorrect = 1;
    if (isDateCorrect && greater == 0) {
      if (
        Number(time1[0]) < Number(time2[0]) ||
        (Number(time1[0]) == Number(time2[0]) &&
          Number(time1[1]) < Number(time2[1]))
      ) {
      } else {
        isTimeCorrect = 0;
      }
    }
    console.log(isDateCorrect, isTimeCorrect);
    if (isDateCorrect == 0 || isTimeCorrect == 0) {
      alert("Fill the time and date fields properly");
      return;
    }

    const updatedContest = {
      contestId: contest._id["$oid"],
      contestName,
      eventType,
      companyName,
      contestStartDate: String(contestStartDate) + "T" + startTime + ":" + "00",
      // startTime,
      contestEndDate: String(contestEndDate) + "T" + endTime + ":" + "00",
      // endTime,
      instructionsTitle,
      instructions,
      route: "contests/modifyContest",
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI2MDc3NzB9.nxH-peUegSz_z8svOa2JTUc9WYHRehFLOtuFZO4ykXM",
    };

    console.log(updatedContest);

    const response = await axios.post(baseURL, updatedContest);
    console.log(response);
    if (response.data.status == 200) {
      const data = {
        authToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1MjE1ODV9.3-O-JVP8eaYRPtXo0q8pTDc3HY3sN91PXDGPmrbqsDo",
        route: "contests/getContestDetails",
        contestName: contestName,
      };
      axios
        .post(baseURL, data)
        .then((response) => {
          setContest(response.data.data.contest);
          console.log(response.data);
          console.log(response.data.data.contest._id["$oid"]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <section className="w-full mt-5">
      <form onSubmit={handleSubmit} className="p-4 w-full flex">
        <div className="w-3/5">
          <div className="py-2">
            <label className="flex place-items-center gap-x-7">
              <p className="w-60 font-medium text-gray-600">
                Contest Name: <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                value={contestName ? contestName : ""}
                onChange={(e) => setContestName(e.target.value)}
                required
                className="w-60 px-4 py-2 border rounded-md"
              />
            </label>
          </div>
          {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
          <div className="py-2">
            <label className="flex place-items-center gap-x-7">
              <p className="w-60 font-medium text-gray-600">
                Event Type: <span className="text-red-500">*</span>
              </p>
              <select
                value={eventType ? eventType : ""}
                onChange={(e) => setEventType(e.target.value)}
                className="w-60 px-4 py-2 border rounded-md"
              >
                <option value="FUN">FUN</option>
                <option value="RECRUITMENT">RECRUITMENT</option>
              </select>
            </label>
          </div>
          {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
          <div className="py-2">
            <label className="flex place-items-center gap-x-7">
              <p className="w-60 font-medium text-gray-600">
                Company Name: <span className="text-red-500">*</span>
              </p>
              <input
                type="text"
                value={companyName ? companyName : ""}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-60 px-4 py-2 border rounded-md"
              />
            </label>
          </div>
          {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
          <div className="py-2">
            <label className="flex place-items-center gap-x-7">
              <p className="w-60 font-medium text-gray-600">
                Contest Start Date<span className="text-red-500">*</span>
              </p>
              <input
                type="date"
                name=""
                id=""
                className="border border-gray-300 pl-3"
                value={contestStartDate ? contestStartDate : ""}
                onChange={(e) => setContestStartDate(e.target.value)}
              />
            </label>
          </div>
          {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
          <div className="py-2">
            <label className="flex gap-x-7">
              <p className="w-60 mt-3 font-medium text-gray-600">
                Start Time (IST, 24 hour time):{" "}
                <span className="text-red-500">*</span>
              </p>
              <div>
                <input
                  type="text"
                  value={startTime ? startTime : ""}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-60 px-4 py-2 border rounded-md"
                  onClick={() => setShowStartTime(true)}
                  onBlur={() => setTimeout(() => setShowStartTime(false), 200)}
                />
                <ul
                  className={`${
                    !showStartTime && "hidden"
                  } absolute bg-white w-60 border px-2 flex flex-col gap-y-1 h-40 overflow-y-scroll`}
                >
                  {possibleTimes.map((time, index) => (
                    <li
                      key={index}
                      onClick={(e) => setStartTime(e.target.innerText)}
                    >
                      {time}
                    </li>
                  ))}
                </ul>
              </div>
            </label>
          </div>
          <div className="py-2">
            <label className="flex place-items-center gap-x-7">
              <p className="w-60 font-medium text-gray-600">
                Contest End Date<span className="text-red-500">*</span>
              </p>
              <input
                type="date"
                name=""
                id=""
                value={contestEndDate ? contestEndDate : ""}
                className="border border-gray-300 pl-3"
                onChange={(e) => {
                  setContestEndDate(e.target.value);
                  console.log("Contest end date", e.target.value);
                }}
              />
            </label>
          </div>
          <div className="py-2">
            <label className="flex gap-x-7">
              <p className="w-60 mt-3 font-medium text-gray-600">
                End Time (IST, 24 hour time):{" "}
                <span className="text-red-500">*</span>
              </p>
              <div>
                <input
                  type="text"
                  value={endTime ? endTime : ""}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-60 px-4 py-2 border rounded-md"
                  onClick={() => setShowEndTime(true)}
                  onBlur={() => setTimeout(() => setShowEndTime(false), 200)}
                />
                <ul
                  className={`${
                    !showEndTime && "hidden"
                  } absolute bg-white w-60 border px-2 flex flex-col gap-y-1 h-40 overflow-y-scroll`}
                >
                  {possibleTimes.map((time, index) => (
                    <li
                      key={index}
                      onClick={(e) => setEndTime(e.target.innerText)}
                    >
                      {time}
                    </li>
                  ))}
                </ul>
              </div>
            </label>
          </div>
          <button
            type="submit"
            className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-300 font-mono my-4"
          >
            Save Changes
          </button>
        </div>
        <div className="w-2/5">
          <Instructions
            instructions={instructions}
            setInstructions={setInstructions}
            instructionsTitle={instructionsTitle}
            setInstructionsTitle={setInstructionsTitle}
          />
        </div>
      </form>
    </section>
  );
};

export default CreateChallangeDetails;
