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
            <p className="w-60 font-medium text-gray-600">Contest Name</p>
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
            <p className="w-60 font-medium text-gray-600">Event Type</p>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-60 px-4 py-2 border outline-gray-400 rounded-md"
            >
              <option value="FUN">FUN</option>
              <option value="RECRUITMENT">RECRUITMENT</option>
            </select>
          </label>
        </div>
        {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
        <div className="py-2">
          <label className="flex place-items-center gap-x-7">
            <p className="w-60 font-medium text-gray-600">Company Name</p>
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
            <p className="w-60 font-medium text-gray-600">Contest Date</p>
            <input
              type="date"
              name=""
              id=""
              className="border border-gray-300 outline-gray-400 pl-3"
              onChange={(e) => setContestDate(e.target.value)}
            />
          </label>
        </div>
        {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
        <div className="py-2">
          <label className="flex place-items-center gap-x-7">
            <p className="w-60 font-medium text-gray-600">
              Start Time (IST, 24 hour time)
            </p>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-60 px-4 py-2 border rounded-md"
            />
          </label>
        </div>

        {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
        <div className="py-2">
          <label className="flex place-items-center gap-x-7">
            <p className="w-60 font-medium text-gray-600">
              Duration (In hours)
            </p>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-60 px-4 py-2 border rounded-md"
            />
          </label>
        </div>
        {/* <hr className="w-full my-2 h-0.5 mx-auto bg-gray-200 border-0 rounded dark:bg-gray-700" /> */}
        <button
          type="submit"
          className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-300 font-mono my-4"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </form>
    </section>
  );
};

export default CreateChallangeDetails;
