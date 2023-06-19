import React, { useState, useEffect } from "react";

import AceEditor from "react-ace";
import { BiTime } from "react-icons/bi";
import { ImCheckmark, ImCross } from "react-icons/im";
import { BsFillGearFill } from "react-icons/bs";
import API from "../utils/API";
import axios from "axios";

import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-kotlin";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow_night_blue";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-solarized_light";
import { baseURL } from "../config/config";

// interface EditorProps {
//   language: string;
//   theme: string;
//   body: string;
//   setBody: (body: string) => void;
//   height?: string;
//   width?: string;
//   readOnly?: boolean;
//   fontSize?: string;
// }

const Editor = ({
  children,
  language,
  theme,
  body,
  setBody,
  height,
  readOnly,
  width,
  fontSize,
  sampleInput,
  sampleOutput,
  contestId,
  question,
  contestantEmail,
}) => {
  // TODO: Change the questionId and contestId
  let questionId = question._id["$oid"];

  const TEST_RESULTS = "TEST_RESULTS";
  const CUSTOM_INPUT = "CUSTOM_INPUT";
  const RUNNING_CODE = "RUNNING_CODE";
  const RUNNING_TESTS = "RUNNING_TESTS";
  const COMPLETED = "completed";
  const SUBMITTING = "SUBMITTING";
  const IDLE = "IDLE";
  const ERROR = "ERROR";

  const [input, setInput] = useState(sampleInput);
  const [output, setOutput] = useState(sampleOutput);
  const [showConsole, setShowConsole] = useState(false);
  const [executionStatus, setExecutionStatus] = useState(IDLE);
  const [submissionStatus, setSubmissionStatus] = useState(IDLE);
  const [submissionId, setSubmissionId] = useState("");

  const [submissionCheckerId, setSubmissionCheckerId] = useState(null);

  const [submissionIdsForTCs, setSubmissionIdsForTCs] = useState([]);
  const [submissionStatusForTCs, setSubmissionStatusForTCs] = useState([]);
  const [resultForTCs, setResultForTCs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [timeWhenQuestionOpened, setTimeWhenQuestionOpened] = useState(
    Date.now()
  );

  const handleSubmitAllTestCases = () => {
    // console.log(submissionStatusForTCs);
    if (submissionStatusForTCs.length > 0) return;
    setSubmissionStatusForTCs(["running"]);
    setShowConsole(RUNNING_TESTS);
    setExecutionStatus(RUNNING_TESTS);
    createSubmissionRunners();
  };

  const createSubmissionRunners = async () => {
    let params = {
      source_code: body,
      language: language,
      input: "",
      api_key: "guest",
    };
    let responses = [];
    console.log(question.hiddenTCs);
    for (let testCase of question.hiddenTCs) {
      responses.push(
        axios.post(`https://api.paiza.io/runners/create`, {
          ...params,
          input: testCase.input,
        })
      );
    }
    responses = await Promise.all(responses);
    let newSubmissionIdsForTCs = [];
    for (let response of responses) {
      newSubmissionIdsForTCs.push(response.data.id);
    }
    setSubmissionIdsForTCs(newSubmissionIdsForTCs);
  };

  useEffect(() => {
    if (submissionIdsForTCs.length > 0) {
      setSubmissionCheckerId(
        setInterval(() => updateSubmissionStatusForTCs(), 1000)
      );
    }
  }, [submissionIdsForTCs]);

  const updateSubmissionStatusForTCs = async () => {
    let responses = [];
    for (let id of submissionIdsForTCs) {
      const params = new URLSearchParams({
        id: id,
        api_key: "guest",
      });
      const queryString = params.toString();
      responses.push(
        axios.get(`https://api.paiza.io/runners/get_status?${queryString}`)
      );
    }
    responses = await Promise.all(responses);
    let newStatuses = responses.map((res) => res.data.status);
    setSubmissionStatusForTCs(newStatuses);
  };

  useEffect(() => {
    const helper = async () => {
      let responses = [];
      for (let id of submissionIdsForTCs) {
        const params = new URLSearchParams({
          id: id,
          api_key: "guest",
        });
        const queryString = params.toString();
        responses.push(
          axios.get(`https://api.paiza.io/runners/get_details?${queryString}`)
        );
      }
      responses = await Promise.all(responses);
      console.log("responses", responses);
      let index = 0,
        score = 0;
      let results = [];
      let time = 0;
      for (let res of responses) {
        console.log(res.data);
        const { stdout, stderr, build_stderr } = res.data;
        let output = "";
        if (stdout) output += stdout;

        console.log(`Before modificationsssss-${output}`);

        output = output.split("\n");
        output.splice(output.length - 1, 1);
        output = output.join("\n");
        output = output.trim();

        // console.log(
        //   `After modification\nFinal Output-----${output}-----END OUTPUT`
        // );

        console.log("Expected Output");
        console.log(question.hiddenTCs);
        console.log("Our Output");
        console.log(output);

        if (question.hiddenTCs[index].output === output) {
          score += 1;
          results.push(1);
          time = Math.max(time, Number(res.data.time));
        } else {
          results.push(0);
        }
        // console.log(output, question.hiddenTCs[index].output);
        index += 1;
      }
      console.log("Time: " + time);
      setSubmissionStatusForTCs([]);
      setExecutionStatus(COMPLETED);
      setShowConsole(COMPLETED);
      setResultForTCs(results);
      if (isSubmitting) {
        console.log("In submitting...");
        const resultForDB = results.map((result) =>
          result ? "Correct" : "Wrong"
        );
        const data = {
          route: "contests/addSubmission",
          // TODO: Change email address
          contestantEmail: contestantEmail,
          contestId: contestId,
          questionId: questionId,
          submissionStatus: resultForDB,
          testCasesPassed: score,
          code: body,
          executionTime: time,
          submissionTime: new Date().getTime(),
          isCorrect: score == resultForDB.length ? 1 : 0,
          timeSpentOnQuestion: Date.now() - timeWhenQuestionOpened,
          language,
        };
        setTimeWhenQuestionOpened(Date.now());
        try {
          const result = await axios.post(baseURL, data);
          //TODO: Display submitted and send to all questions page
        } catch (err) {
          console.log(err);
        }
      }
      setIsSubmitting(false);
    };
    let isCompleted =
      submissionStatusForTCs.filter((status) => status !== COMPLETED).length ===
      0;
    if (submissionCheckerId && isCompleted) {
      clearInterval(submissionCheckerId);
      setSubmissionCheckerId(null);
      helper();
    }
  }, [submissionStatusForTCs]);

  const handleSubmit = () => {
    if (submissionStatus === RUNNING_CODE) return;
    console.log(body);
    setSubmissionStatus(RUNNING_CODE);
    setShowConsole(RUNNING_CODE);
    setExecutionStatus(RUNNING_CODE);
    const params = {
      source_code: body,
      language: language,
      input: input,
      api_key: "guest",
    };
    console.log(input, typeof input);
    API.post(`https://api.paiza.io/runners/create`, params)
      .then((res) => {
        const { id, status } = res.data;
        setSubmissionId(id);
        setSubmissionStatus(status);
      })
      .catch((err) => {
        setSubmissionId("");
        setSubmissionStatus(ERROR);
      });
  };

  useEffect(() => {
    if (submissionId) {
      setSubmissionCheckerId(setInterval(() => updateSubmissionStatus(), 1000));
    }
  }, [submissionId]);

  const updateSubmissionStatus = () => {
    const params = new URLSearchParams({
      id: submissionId,
      api_key: "guest",
    });
    const querystring = params.toString();
    API.get(`https://api.paiza.io/runners/get_status?${querystring}`).then(
      (res) => {
        const { status } = res.data;
        setSubmissionStatus(status);
      }
    );
  };

  useEffect(() => {
    if (submissionCheckerId && submissionStatus === COMPLETED) {
      clearInterval(submissionCheckerId);
      setSubmissionCheckerId(null);
      setExecutionStatus(IDLE);
      const params = new URLSearchParams({
        id: submissionId,
        api_key: "guest",
      });
      const querystring = params.toString();
      API.get(`https://api.paiza.io/runners/get_details?${querystring}`).then(
        (res) => {
          const { stdout, stderr, build_stderr } = res.data;
          console.log(res.data);
          let output = "";
          if (stdout) output += stdout;
          if (stderr) output += stderr;
          if (build_stderr) output += build_stderr;
          setOutput(output);
        }
      );
    }
  }, [submissionStatus]);

  useEffect(() => {
    if (executionStatus === RUNNING_CODE) {
      setOutput("");
    }
  }, [executionStatus]);

  return (
    <div className={`w-full flex flex-col overflow-x-scroll`}>
      {children}
      {() => {
        try {
          return (
            <AceEditor
              mode={language}
              theme={theme}
              onChange={(value) => setBody(value)}
              // onChange={(e) => console.log(e)}
              value={body}
              width={width ? width : "100%"}
              height={height ? height : "73vh"}
              readOnly={readOnly ? readOnly : false}
              fontSize={fontSize ? (isNaN(+fontSize) ? 12 : +fontSize) : 12}
              name="UNIQUE_ID_OF_DIV"
              showGutter={true}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            />
          );
        } catch (e) {
          return (
            <AceEditor
              mode={language}
              theme={theme}
              onChange={(value) => setBody(value)}
              // onChange={(e) => console.log(e)}
              value={body}
              width={width ? width : "100%"}
              height={height ? height : "73vh"}
              readOnly={readOnly ? readOnly : false}
              fontSize={fontSize ? (isNaN(+fontSize) ? 12 : +fontSize) : 12}
              name="UNIQUE_ID_OF_DIV"
              showGutter={true}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            />
          );
        }
      }}
      <div id="ouput" className="flex justify-between border-t border-black">
        <div className="flex text-gray-600">
          <button
            className={`px-5 py-3 text-lg font-semibold ${
              showConsole === TEST_RESULTS &&
              "border-t-4 border-sky-600 bg-gray-200"
            }`}
            onClick={() => {
              setShowConsole("TEST_RESULTS");
            }}
          >
            Test Results
          </button>
          <button
            className={`px-5 py-3 text-lg font-semibold ${
              showConsole === CUSTOM_INPUT &&
              "border-t-2 border-sky-700 bg-gray-200"
            }`}
            onClick={() => {
              setShowConsole("CUSTOM_INPUT");
            }}
          >
            Custom Input
          </button>
        </div>
        <div className="flex text-white font-semibold">
          <button
            className={`px-4 bg-[#0a7bbf] ${
              (executionStatus === RUNNING_CODE ||
                executionStatus === RUNNING_TESTS) &&
              "cursor-not-allowed opacity-40"
            }`}
            disabled={
              executionStatus === RUNNING_CODE ||
              executionStatus === RUNNING_TESTS
            }
            onClick={() => {
              handleSubmit();
            }}
          >
            Run Code
          </button>
          <button
            className={`px-4 bg-black ${
              (executionStatus === RUNNING_TESTS ||
                executionStatus === RUNNING_CODE) &&
              "cursor-not-allowed opacity-40"
            }`}
            disabled={
              executionStatus === RUNNING_CODE ||
              executionStatus === RUNNING_TESTS
            }
            onClick={() => {
              handleSubmitAllTestCases();
            }}
          >
            Run Tests
          </button>
          <button
            className={`px-4 bg-[#408a32] ${
              executionStatus === SUBMITTING && "cursor-not-allowed opacity-40"
            }`}
            disabled={executionStatus === SUBMITTING}
            // onClick={() => {
            //   setShowConsole(SUBMITTING);
            //   setExecutionStatus(SUBMITTING);
            // }}
            onClick={() => {
              setIsSubmitting(true);
              handleSubmitAllTestCases();
            }}
          >
            Submit
          </button>
        </div>
      </div>
      {showConsole === RUNNING_CODE && (
        <div className="w-full flex bg-gray-200 h-[90%] overflow-y-scroll">
          <div className="w-[95%] mx-auto">
            <p className="text-gray-700 text-2xl font-semibold mb-2">Input :</p>
            <div className="bg-white p-4 rounded-md w-full overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] mb-4">
              {input ? (
                input
                  .split("\n")
                  .map((line, index) => <p key={index}>{line}</p>)
              ) : (
                <p> </p>
              )}
            </div>
            {executionStatus === RUNNING_CODE && (
              <>
                <p className="text-xl font-semibold text-gray-800 mb-3">
                  Running Code...
                </p>
                <div className="flex w-full justify-center place-items-center">
                  <img
                    src="https://thumbs.gfycat.com/YoungWeakCanadagoose-max-1mb.gif"
                    alt="Loading"
                    className="w-40"
                  />
                </div>
              </>
            )}
            {executionStatus === IDLE && (
              <>
                <p className="text-gray-700 text-2xl font-semibold mb-2">
                  Output :
                </p>
                <div className="bg-white p-4 rounded-md w-full overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  {output.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {showConsole === TEST_RESULTS && (
        <div className="w-full flex bg-gray-200 h-[90%] overflow-y-scroll">
          <div className="w-[95%] mx-auto">
            <p className="text-gray-700 text-2xl font-semibold mb-2">Input :</p>
            <div className="bg-white p-4 rounded-md w-full overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] mb-4">
              {input.split("\n").map((line) => (
                <p>{line}</p>
              ))}
            </div>
            <p className="text-gray-700 text-2xl font-semibold mb-2">
              Output :
            </p>
            <div className="bg-white p-4 rounded-md w-full overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {output ? (
                output
                  .split("\n")
                  .map((line, index) => <p key={index}>{line}</p>)
              ) : (
                <p> </p>
              )}
            </div>
          </div>
        </div>
      )}
      {showConsole === CUSTOM_INPUT && (
        <div className="w-full flex bg-gray-200 h-[90%] overflow-y-scroll">
          <div className="w-[95%] mx-auto p-5">
            <p className="text-xl font-semibold mb-1">Custom Input :</p>
            <textarea
              name={CUSTOM_INPUT}
              id={CUSTOM_INPUT}
              cols="40"
              rows="9"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="rounded-md resize-none px-2 py-2 outline-none border-2 border-gray-400 shadow-md shadow-gray-400"
            />
          </div>
        </div>
      )}
      {showConsole === RUNNING_TESTS && executionStatus === RUNNING_TESTS && (
        <div className="w-full flex flex-col bg-gray-200 h-[90%] overflow-y-scroll">
          <p className="w-[95%] mx-auto font-semibold text-xl py-2">
            Running Test Cases :
          </p>
          <div className="w-5/6 mx-auto h-full grid grid-cols-5 justify-evenly place-items-center">
            {question.hiddenTCs.map((testCase, idx) => {
              return (
                <p className="flex place-items-center gap-x-2">
                  <BsFillGearFill size={22} className="animate-spin" />
                  TC {idx}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {showConsole === COMPLETED && executionStatus === COMPLETED && (
        <div className="w-full flex flex-col bg-gray-200 h-[90%] overflow-y-scroll">
          <p className="w-[95%] mx-auto font-semibold text-xl py-2">
            Result of Test Cases :
          </p>
          <div className="w-5/6 mx-auto h-full grid grid-cols-5 justify-evenly place-items-center">
            {question.hiddenTCs.map((testCase, idx) => {
              return (
                <p className="flex place-items-center gap-x-2">
                  TC {idx}
                  {resultForTCs[idx] == 1 ? (
                    <ImCheckmark size={24} className="text-green-600" />
                  ) : (
                    resultForTCs[idx] == 0 && (
                      <ImCross size={20} className="text-red-500" />
                    )
                  )}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
