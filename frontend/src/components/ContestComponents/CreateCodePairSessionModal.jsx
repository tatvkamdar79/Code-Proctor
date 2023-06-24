import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";

const CreateCodePairSessionModal = ({ submissions, close }) => {
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [codePairSessions, setCodePairSession] = useState([]);
  const [errorIndexes, setErrorIndexes] = useState([]);

  useEffect(() => {
    if (submissions) {
      let temp = [];
      let newCodePairSessions = [];
      for (let i = 0; i < submissions.length; i++) {
        temp.push(0);
        newCodePairSessions.push({
          candidate: submissions[i],
          interviewer: "",
          year: -1,
          month: -1,
          day: -1,
          hours: -1,
          minutes: -1,
        });
      }
      setSelected(temp);
      setCodePairSession(newCodePairSessions);
    }
  }, [submissions]);

  const interviewers = ["tatva.k@darwinbox.io", "aman.j@darwinbox.io"];

  const validateCodePairSessions = (sessionIndexes) => {
    for (let sessionIndex of sessionIndexes) {
      if (
        codePairSessions[sessionIndex]["candidate"] === "" ||
        codePairSessions[sessionIndex]["interviewer"] === "" ||
        codePairSessions[sessionIndex]["year"] === -1 ||
        codePairSessions[sessionIndex]["month"] === -1 ||
        codePairSessions[sessionIndex]["day"] === -1 ||
        codePairSessions[sessionIndex]["hours"] === -1 ||
        codePairSessions[sessionIndex]["minutes"] === -1
      ) {
        setErrorIndexes((errorIndexes) => [...errorIndexes, sessionIndex]);
        return false;
      } else {
        if (errorIndexes.includes(sessionIndex)) {
          let newErrorIndexes = [...errorIndexes];
          newErrorIndexes.splice(errorIndexes.indexOf(sessionIndex), 1);
          setErrorIndexes(newErrorIndexes);
        }
      }
    }
    return true;
  };

  return (
    <div className="w-full h-full flex flex-col justify-center place-items-center">
      <div className="w-2/3 h-2/3 border-2 border-gray-300 bg-white rounded-xl p-4 relative">
        <p className="font-semibold font-mono text-3xl text-center">
          Create Code Pair Sessions
        </p>
        <button
          className="font-semibold font-mono text-2xl absolute top-2 left-3 hover:scale-125 transition-all"
          onClick={() => close(false)}
        >
          X
        </button>
        <section className="flex gap-x-4">
          <table className="table-auto">
            <thead>
              <th className="w-20 border-2 border-green-400 rounded-md">
                Select
              </th>
              <th className="w-60 border-2 border-green-400 rounded-md">
                Candidate
              </th>
              <th className="w-60 border-2 border-green-400 rounded-md">
                Interviewer
              </th>
              <th className="w-80 border-2 border-green-400 rounded-md">
                Scheduled Time
              </th>
            </thead>
            <tbody>
              {submissions &&
                submissions.map((email, index) => (
                  <tr
                    className={`border min-h-10 ${
                      errorIndexes.includes(index) && "bg-orange-400"
                    } transition-all duration-500`}
                  >
                    <td
                      className="p-2 border-2 border-gray-300 w-20"
                      onClick={(e) => {
                        console.log(codePairSessions[index]);
                        if (!validateCodePairSessions([index])) {
                          return;
                        }
                        let newSelected = [...selected];
                        if (newSelected[index] == 0) {
                          newSelected[index] = 1;
                        } else {
                          newSelected[index] = 0;
                        }
                        setSelected(newSelected);
                      }}
                    >
                      <button
                        className={`mx-auto h-6 w-6 border border-gray-300 flex justify-center place-items-center transition-all duration-200 ${
                          selected[index] === 1 && "bg-green-500"
                        }`}
                      >
                        {selected[index] === 1 && (
                          <AiOutlineCheck size={20} className="text-white" />
                        )}
                      </button>
                    </td>
                    <td className="p-2 border-2 border-gray-300 w-60 font-semibold font-mono">
                      {email}
                    </td>
                    <td className="p-2 border-2 border-gray-300 w-60">
                      <select
                        name="interviewers"
                        id="interviewers"
                        defaultValue={"none"}
                        onChange={(e) => {
                          console.log(e.target.value);
                          let newCodePairSessions = [...codePairSessions];
                          newCodePairSessions[index]["interviewer"] =
                            e.target.value;
                          setCodePairSession(newCodePairSessions);
                        }}
                      >
                        <option value="none" disabled unselectable="on">
                          Interviewer
                        </option>
                        {interviewers.map((email, innerIndex) => (
                          <option value={email} key={innerIndex}>
                            {email}
                          </option>
                        ))}
                      </select>
                      {/* <input
                        type="text"
                        className="border border-green-300 rounded-md p-1 px-2 outline-none focus:outline-none focus:border-green-500 transition-all"
                        placeholder="Search Interviewer's..."
                      /> */}
                    </td>
                    <td className="p-2 border-2 border-gray-300 w-80">
                      <input
                        type="date"
                        name=""
                        id=""
                        className="border border-gray-200 rounded-md px-2 w-[50%] mx-1"
                        onChange={(e) => {
                          let date = e.target.value.split("-");
                          let year = date[0];
                          let month = date[1];
                          let day = date[2];

                          let newCodePairSessions = [...codePairSessions];
                          newCodePairSessions[index]["year"] = year;
                          newCodePairSessions[index]["month"] = month;
                          newCodePairSessions[index]["day"] = day;
                          setCodePairSession(newCodePairSessions);
                        }}
                      />
                      <input
                        type="time"
                        name=""
                        id=""
                        className="border border-gray-200 rounded-md px-2 w-[40%] mx-1"
                        onChange={(e) => {
                          let time = e.target.value.split(":");
                          let hours = parseInt(time[0], 10);
                          let minutes = parseInt(time[1], 10);

                          let newCodePairSessions = [...codePairSessions];
                          newCodePairSessions[index]["hours"] = hours;
                          newCodePairSessions[index]["minutes"] = minutes;
                          setCodePairSession(newCodePairSessions);
                        }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div
            className="font-semibold font-mono text-xl flex h-fit justify-center place-items-center gap-x-2"
            onClick={() => {
              if (selectAll) {
                setSelected(submissions.map((x) => 0));
                setSelectAll(false);
              } else {
                console.log(codePairSessions.map((x, ind) => ind));
                if (
                  validateCodePairSessions(
                    codePairSessions.map((_, idx) => idx)
                  )
                ) {
                  setSelected(submissions.map((x) => 1));
                  setSelectAll(true);
                }
              }
            }}
          >
            <button
              className={`mx-auto h-6 w-6 border border-gray-300 flex justify-center place-items-center ${
                selectAll && "bg-green-500"
              }`}
            >
              {selectAll && <AiOutlineCheck size={20} className="text-white" />}
            </button>
            <p>{selectAll ? "Unselect All" : "Select All"}</p>
          </div>
        </section>
        <section className="absolute -bottom-0.5 -right-0.5 w-full flex place-items-end justify-end">
          <button className="font-semibold font-mono text-xl px-2 py-1 bg-green-500 rounded-lg">
            Create Code Pair Sessions
          </button>
        </section>
      </div>
    </div>
  );
};

export default CreateCodePairSessionModal;
