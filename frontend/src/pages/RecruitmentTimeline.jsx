import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

const RecruitmentTimeline = () => {
  const [timelines, setTimelines] = useState([]);

  const addTimeline = () => {
    const newTimeline = {
      contest: "",
      date: "",
      time: "",
    };
    setTimelines([...timelines, newTimeline]);
  };

  const handleContestChange = (event, index) => {
    const updatedTimelines = [...timelines];
    updatedTimelines[index].contest = event.target.value;
    setTimelines(updatedTimelines);
  };

  const handleDateChange = (event, index) => {
    const updatedTimelines = [...timelines];
    updatedTimelines[index].date = event.target.value;
    setTimelines(updatedTimelines);
  };

  const handleTimeChange = (event, index) => {
    const updatedTimelines = [...timelines];
    updatedTimelines[index].time = event.target.value;
    setTimelines(updatedTimelines);
  };

  const deleteTimeline = (index) => {
    const updatedTimelines = [...timelines];
    updatedTimelines.splice(index, 1);
    setTimelines(updatedTimelines);
  };

  return (
    <div className="w-5/6 p-4 grid grid-cols-4 gap-4 mx-auto">
      <button
        className="w-1/3 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        onClick={addTimeline}
      >
        Add Timeline
      </button>
      {timelines.map((timeline, index) => (
        <div key={index} className="bg-white rounded shadow">
          <div className="p-4 flex justify-between items-center border-b">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Search Contest"
              value={timeline.contest}
              onChange={(event) => handleContestChange(event, index)}
            />
            <button
              className="ml-4 text-red-500 focus:outline-none"
              onClick={() => deleteTimeline(index)}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-2">
              <input
                className="w-1/2 p-2 border border-gray-300 rounded"
                type="date"
                value={timeline.date}
                onChange={(event) => handleDateChange(event, index)}
              />
              <input
                className="w-1/2 ml-2 p-2 border border-gray-300 rounded"
                type="time"
                value={timeline.time}
                onChange={(event) => handleTimeChange(event, index)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecruitmentTimeline;
