import React, { useState } from "react";

const CreateChallangeDetails = () => {
  const [contestName, setContestName] = useState("");
  const [eventType, setEventType] = useState("FUN");
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT");
  };

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
