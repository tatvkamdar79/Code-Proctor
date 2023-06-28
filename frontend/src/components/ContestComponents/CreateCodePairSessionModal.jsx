import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../config/config";
import { getCookie } from "../../Hooks/useCookies";

const CreateCodePairSessionModal = ({ contest, submissions, close }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [codePairSessions, setCodePairSession] = useState([]);
  const [errorIndexes, setErrorIndexes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (submissions) {
      let temp = [];
      let newCodePairSessions = [];
      for (let i = 0; i < submissions.length; i++) {
        // 0 indicates it is not selected
        temp.push(0);
        newCodePairSessions.push({
          intervieweeEmail: submissions[i],
          interviewerEmail: "",
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

  const createCodePairSessionsInBulk = async () => {
    console.log(codePairSessions);
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    let contestName = contest.contestName;
    console.log(contestName);

    const data = {
      authToken: jwt,
      route: "room/createRoomsInBulk",
      contestName,
      codePairSessions,
      title: `Code Pair Session for ${contestName}`,
    };

    const response = axios.post(baseURL, data);
  };

  const validateCodePairSessions = (sessionIndexes) => {
    if (sessionIndexes.length === 0) return false;
    for (let sessionIndex of sessionIndexes) {
      if (sessionIndex === -1) continue;
      if (
        codePairSessions[sessionIndex]["intervieweeEmail"] === "" ||
        codePairSessions[sessionIndex]["interviewerEmail"] === "" ||
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
      <div className="w-2/3 h-3/4 border-4 border-green-600 bg-gray-50 rounded-xl p-4 relative">
        <p className="font-semibold font-mono text-4xl text-center mb-3 border-b-2 border-gray-400">
          Create Bulk Code Pair Sessions Tool
        </p>
        <button
          className="font-semibold font-mono text-3xl absolute top-2 right-3 hover:scale-125 transition-all text-red-500"
          onClick={() => close(false)}
        >
          X
        </button>
        <section className="flex gap-x-4 border border-gray-500 h-[85%] overflow-y-scroll">
          <table className="table-auto h-fit">
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
                        className={`mx-auto h-6 w-6 border border-green-500 flex justify-center place-items-center transition-all duration-200 ${
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
                          newCodePairSessions[index]["interviewerEmail"] =
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
            className="font-semibold font-mono text-xl flex flex-col h-fit justify-center place-items-start gap-x-2 mt-2 gap-y-3"
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
            <div className="flex place-items-center gap-x-2">
              <button
                className={`mx-auto h-6 w-6 border border-gray-500 flex justify-center place-items-center ${
                  selectAll && "bg-green-500"
                }`}
              >
                {selectAll && (
                  <AiOutlineCheck size={20} className="text-white" />
                )}
              </button>
              <p>{selectAll ? "Unselect All" : "Select All"}</p>
            </div>
            {errorMessage !== "" && (
              <div className="">
                <p className="text-sm font-semibold font-mono text-orange-500">
                  * {errorMessage}.
                </p>
              </div>
            )}
          </div>
        </section>
        <section className="absolute -bottom-0.5 -right-0.5 w-full flex place-items-end justify-between">
          <p className="font-semibold font-mono text-sm mb-2 text-gray-800 w-1/2 flex">
            <span className="text-base text-red-500 w-3.5">*</span>
            <span className="w-2/3">
              Duplicate Rooms with the same interviewer and interviewee in this
              contest will not be created.
            </span>
          </p>
          <button
            className="font-semibold font-mono text-xl px-10 py-2 bg-green-600 rounded-lg text-gray-900 hover:px-32 hover:py-3.5 transition-all duration-500 hover:text-white"
            onClick={() => {
              console.log(selected);
              console.log(
                selected.map((_, index) => {
                  if (_ === 1) return index;
                  else return -1;
                })
              );
              if (
                validateCodePairSessions(
                  selected.map((_, index) => {
                    if (_ === 1) return index;
                    else return -1;
                  })
                )
              ) {
                console.log("All sessions Validated");
                setErrorMessage("");
                createCodePairSessionsInBulk();
              } else {
                console.log("Please fill out all the fields");
                setErrorMessage("Please fill out all the fields");
              }
            }}
          >
            Create Code Pair Sessions
          </button>
        </section>
      </div>
    </div>
  );
};

export default CreateCodePairSessionModal;
