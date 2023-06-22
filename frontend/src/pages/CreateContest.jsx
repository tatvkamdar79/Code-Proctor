import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../config/config";
import loading from "../assets/createContestLoading.gif";
import { getCookie } from "../Hooks/useCookies";

const CreateContest = () => {
  const navigate = useNavigate();
  const [contestName, setContestName] = useState("");
  const [eventType, setEventType] = useState("FUN");
  const [companyName, setCompanyName] = useState("");
  const [contestStartDate, setContestStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [contestEndDate, setContestEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const handleGetStarted = (e) => {
    e.preventDefault();
    // const contest = {
    //   contestName,
    //   eventType,
    //   companyName,
    //   contestStartDate,
    //   startTime,
    //   contestEndDate,
    //   endTime,
    //   instructions: [],
    //   questions: [],
    //   contestants: []
    // }
    // console.log(contest)
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // const formattedDate = currentDate.toLocaleString(undefined, options);

  const convertDateFormat = (dateString) => {
    const parts = dateString.split("/"); // Split the date string into parts
    console.log("Parts is", parts);
    // Rearrange the parts in the desired order (yyyy-mm-dd)
    const year = parts[2].split(",")[0];
    const formattedDate = `${year}-${parts[1]}-${parts[0]}`;
    console.log(formattedDate);
    return formattedDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let jwt = getCookie("JWT_AUTH");

    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    setSubmitting(true);

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
    console.log(time1, time2);
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
      setSubmitting(false);
      alert("Fill the time and date fields properly");
      return;
    }

    const contest = {
      contestName,
      eventType,
      companyName,
      contestStartDate: String(contestStartDate) + "T" + startTime + ":" + "00",
      // startTime,
      contestEndDate: String(contestEndDate) + "T" + endTime + ":" + "00",
      // endTime,
      instructions: [],
      questions: [],
      contestants: [],
      route: "contests/create",
      authToken: jwt,
    };

    console.log(contest);
    try {
      const response = await axios.post(baseURL, contest);
      console.log(response.data.status);
      if (response.data.status === 200) {
        setSubmitting(false);
        console.log("SUCCESS", response);
        navigate(`/contest/manage/${contestName}`, {
          state: { newContest: true },
        });
      } else if (response.data.status === 400) {
        console.log("PROBLEM!", response);
        setSubmitting(false);
        alert(response.data.message);
      } else {
        setSubmitting(false);
        alert("Error Occured");
      }
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      alert(`Oops! Seems like some error occured!, Please try again :)).`);
    }
  };

  useEffect(() => {
    console.log(contestStartDate);
  }, [contestStartDate]);

  useEffect(() => {
    console.log(contestEndDate);
  }, [contestEndDate]);

  return (
    <div className="flex justify-center place-items-center h-[90vh] w-screen p-5">
      <div
        className={`w-11/12 lg:w-2/3 flex flex-col ml-10 lg:mx-auto ${
          submitting && "blur-sm"
        }`}
      >
        <div className={`w-2/3`}>
          <div className="w-full h-full flex flex-col gap-y-3 justify-center">
            <p className="text-2xl font-medium text-gray-700">Create Contest</p>
            <p className="font-normal text-gray-400 italic">
              Host your own coding contest on HackerRank. You can practice and
              compete with friends from your organization or school. Select from
              our library of over 1,500 coding challenges or create your own.
            </p>
            <p className="italic text-gray-400">
              Get started by providing the initial details for your contest.
            </p>
          </div>
        </div>
        <div className="flex h-[60.5vh]">
          <form onSubmit={handleSubmit} className="w-full p-4">
            <div className="py-2 w-fit">
              <label className="flex place-items-center gap-x-7">
                <p className="w-60 font-medium text-gray-600">
                  Contest Name: <span className="text-red-500">*</span>
                </p>
                <input
                  type="text"
                  value={contestName}
                  onChange={(e) => setContestName(e.target.value)}
                  required
                  className="w-60 px-4 py-2 border rounded-md"
                />
              </label>
            </div>
            {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
            <div className="py-2 w-fit">
              <label className="flex place-items-center gap-x-7">
                <p className="w-60 font-medium text-gray-600">
                  Event Type: <span className="text-red-500">*</span>
                </p>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-60 px-4 py-2 border rounded-md"
                >
                  <option value="FUN">FUN</option>
                  <option value="RECRUITMENT">RECRUITMENT</option>
                </select>
              </label>
            </div>
            {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
            <div className="py-2 w-fit">
              <label className="flex place-items-center gap-x-7">
                <p className="w-60 font-medium text-gray-600">
                  Company Name: <span className="text-red-500">*</span>
                </p>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-60 px-4 py-2 border rounded-md"
                />
              </label>
            </div>
            {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
            <div className="py-2 w-fit">
              <label className="flex place-items-center gap-x-7">
                <p className="w-60 font-medium text-gray-600">
                  Contest Start Date<span className="text-red-500">*</span>
                </p>
                <input
                  type="date"
                  name=""
                  id=""
                  className="border border-gray-300 pl-3"
                  onChange={(e) => setContestStartDate(e.target.value)}
                  required
                />
              </label>
            </div>
            {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
            <div className="py-2 w-fit">
              <label className="flex gap-x-7">
                <p className="w-60 mt-3 font-medium text-gray-600">
                  Start Time (IST, 24 hour time):{" "}
                  <span className="text-red-500">*</span>
                </p>
                <div>
                  <input
                    type="text"
                    value={startTime}
                    readOnly
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-60 px-4 py-2 border rounded-md"
                    onFocus={() => setShowStartTime(true)}
                    onBlur={() =>
                      setTimeout(() => setShowStartTime(false), 200)
                    }
                  />
                  <ul
                    className={`${
                      !showStartTime && "hidden"
                    } absolute bg-white w-60 border px-2 flex flex-col gap-y-1 h-40 overflow-y-scroll`}
                  >
                    {possibleTimes.map((time) => (
                      <li onClick={(e) => setStartTime(e.target.innerText)}>
                        {time}
                      </li>
                    ))}
                  </ul>
                </div>
              </label>
            </div>
            <div className="py-2 w-fit">
              <label className="flex place-items-center gap-x-7">
                <p className="w-60 font-medium text-gray-600">
                  Contest End Date<span className="text-red-500">*</span>
                </p>
                <input
                  type="date"
                  name=""
                  id=""
                  className="border border-gray-300 pl-3"
                  onChange={(e) => setContestEndDate(e.target.value)}
                />
              </label>
            </div>
            <div className="py-2 w-fit">
              <label className="flex gap-x-7">
                <p className="w-60 mt-3 font-medium text-gray-600">
                  End Time (IST, 24 hour time):{" "}
                  <span className="text-red-500">*</span>
                </p>
                <div>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-60 px-4 py-2 border rounded-md"
                    onFocus={() => setShowEndTime(true)}
                    onBlur={() => setTimeout(() => setShowEndTime(false), 200)}
                  />
                  <ul
                    className={`${
                      !showEndTime && "hidden"
                    } absolute bg-white w-60 border px-2 flex flex-col gap-y-1 h-40 overflow-y-scroll`}
                    autoFocus
                  >
                    {possibleTimes.map((time) => (
                      <li onClick={(e) => setEndTime(e.target.innerText)}>
                        {time}
                      </li>
                    ))}
                  </ul>
                </div>
              </label>
            </div>
            <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" />
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-300 font-mono my-4"
              // onClick={handleGetStarted}
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
      {submitting && (
        <div className="absolute top-0 left-0">
          <div className="w-[100vw] h-screen flex flex-col place-items-center justify-center">
            <p className="text-3xl font-semibold font-mono">
              Hold On! While we work our magic!
            </p>
            <img
              src={loading}
              alt="Submitting..."
              className="rounded-xl scale-75"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContest;
