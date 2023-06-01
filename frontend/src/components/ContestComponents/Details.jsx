import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateChallangeDetails = () => {
  const navigate = useNavigate();
  const [contestName, setContestName] = useState("");
  const [eventType, setEventType] = useState("FUN");
  const [companyName, setCompanyName] = useState("");
  const [contestDate, setContestDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [contestEndDate, setContestEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

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

  useEffect(() => {
    setContestName("Contest Name");
    setEventType("RECRUITMENT");
    setCompanyName("DBOX");
    setStartTime("00:00");
    setDuration(2);
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT");
    const date = convertDateFormat(new Date().toLocaleString());
    console.log(contestDate, date);
    const d1 = contestDate.split("-");
    const d2 = date.split("-");
    let greater = 0;
    for (let i = 0; i < 3; i++) {
      console.log(greater);
      console.log(Number(d1[i]), Number(d2[i]));
      if (Number(d1[i]) < Number(d2[i]) && greater == 0) {
        alert("Please enter a valid date");
      } else if (Number(d1[i]) > Number(d2[i])) {
        greater = 1;
      }
    }
  };

  useEffect(() => {
    console.log(contestDate);
  }, [contestDate]);

  return (
    <section className="w-5/6 lg:w-2/3 ml-10 lg:mx-auto">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="py-2">
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
        <div className="py-2">
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
        <div className="py-2">
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
              onChange={(e) => setContestDate(e.target.value)}
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
                value={startTime}
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
                {possibleTimes.map((time) => (
                  <li onClick={(e) => setStartTime(e.target.innerText)}>
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
              className="border border-gray-300 pl-3"
              onChange={(e) => setContestEndDate(e.target.value)}
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
                value={endTime}
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
                {possibleTimes.map((time) => (
                  <li onClick={(e) => setEndTime(e.target.innerText)}>
                    {time}
                  </li>
                ))}
              </ul>
            </div>
          </label>
        </div>
        {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
        {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
        <button
          type="submit"
          className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-300 font-mono my-4"
          // onClick={handleGetStarted}
        >
          Get Started
        </button>
      </form>
    </section>
  );
};

export default CreateChallangeDetails;
