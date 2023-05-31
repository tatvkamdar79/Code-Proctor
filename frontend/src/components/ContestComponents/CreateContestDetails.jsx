import React, { useEffect, useState } from "react";

const CreateChallangeDetails = () => {
  const [contestName, setContestName] = useState("");
  const [eventType, setEventType] = useState("FUN");
  const [companyName, setCompanyName] = useState("");
  const [contestDate, setContestDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");

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
    <section className="w-11/12 mx-auto">
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="flex place-items-center gap-x-7">
            <p className="w-60 font-semibold text-xl">Contest Name:</p>
            <input
              type="text"
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </label>
        </div>
        <hr className="w-full my-2 h-0.5 mx-auto bg-gray-100 border-0 rounded dark:bg-gray-700" />
        <div className="mb-4">
          <label className="flex place-items-center gap-x-7">
            <p className="w-60 font-semibold text-xl">Event Type:</p>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            >
              <option value="FUN">FUN</option>
              <option value="RECRUITMENT">RECRUITMENT</option>
            </select>
          </label>
        </div>
        <hr className="w-full my-2 h-0.5 mx-auto bg-gray-100 border-0 rounded dark:bg-gray-700" />
        <div className="mb-4">
          <label className="flex place-items-center gap-x-7">
            <p className="w-60 font-semibold text-xl">Company Name:</p>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </label>
        </div>
        <hr className="w-full my-2 h-0.5 mx-auto bg-gray-100 border-0 rounded dark:bg-gray-700" />
        <div className="mb-4">
          <label className="flex place-items-center gap-x-7">
            <p className="w-48 font-semibold text-xl">Contest Date:</p>
            <input
              type="date"
              name=""
              id=""
              className="border border-black font-semibold pl-3 text-lg"
              onChange={(e) => setContestDate(e.target.value)}
            />
          </label>
        </div>
        <hr className="w-full my-2 h-0.5 mx-auto bg-gray-100 border-0 rounded dark:bg-gray-700" />
        <div className="mb-4">
          <label className="flex place-items-center gap-x-7">
            <p className="w-60 font-semibold text-xl">
              Start Time (IST, 24 hour time):
            </p>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </label>
        </div>

        <hr className="w-full my-2 h-0.5 mx-auto bg-gray-100 border-0 rounded dark:bg-gray-700" />
        <div className="mb-4">
          <label className="flex place-items-center gap-x-7">
            <p className="w-60 font-semibold text-xl">Duration (In hours):</p>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </label>
        </div>
        <hr className="w-full my-2 h-0.5 mx-auto bg-gray-100 border-0 rounded dark:bg-gray-700" />
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Create Test
        </button>
      </form>
    </section>
  );
};

export default CreateChallangeDetails;
