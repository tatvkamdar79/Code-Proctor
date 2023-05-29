import React, { useState } from "react";

import AceEditor from "react-ace";
import { BiTime } from "react-icons/bi";
import { BsFillGearFill } from "react-icons/bs";

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
  input,
  output,
  setOutput,
}) => {
  input = "lkdsjflkds\n";
  const TEST_RESULTS = "TEST_RESULTS";
  const CUSTOM_INPUT = "CUSTOM_INPUT";
  const RUNNING_CODE = "RUNNING_CODE";
  const RUNNING_TESTS = "RUNNING_TESTS";
  const SUBMITTING = "SUBMITTING";
  const IDLE = "IDLE";

  const [showConsole, setShowConsole] = useState(false);
  const [executionStatus, setExecutionStatus] = useState(IDLE);
  return (
    <div className={`w-full flex flex-col overflow-x-scroll`}>
      {children}
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
              setShowConsole(RUNNING_CODE);
              setExecutionStatus(RUNNING_CODE);
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
              setShowConsole(RUNNING_TESTS);
              setExecutionStatus(RUNNING_TESTS);
            }}
          >
            Run Tests
          </button>
          <button
            className={`px-4 bg-[#408a32] ${
              executionStatus === SUBMITTING && "cursor-not-allowed opacity-40"
            }`}
            disabled={executionStatus === SUBMITTING}
            onClick={() => {
              setShowConsole(SUBMITTING);
              setExecutionStatus(SUBMITTING);
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
              {input.split("\n").map((line) => (
                <p>{line}</p>
              ))}
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
                  {"542365132653242654324532765432654326542365\n2\n3\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh"
                    .split("\n")
                    .map((line) => (
                      <p>{line}</p>
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
              {"542365132653242654324532765432654326542365\n2\n3\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh\njhfkdsjh"
                .split("\n")
                .map((line) => (
                  <p>{line}</p>
                ))}
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
            <p className="flex place-items-center gap-x-2">
              <BsFillGearFill size={22} className="animate-spin" />
              TC 1
            </p>
            <p className="flex place-items-center gap-x-2">
              <BsFillGearFill size={22} className="animate-spin" />
              TC 1
            </p>
            <p className="flex place-items-center gap-x-2">
              <BsFillGearFill size={22} className="animate-spin" />
              TC 1
            </p>
            <p className="flex place-items-center gap-x-2">
              <BsFillGearFill size={22} className="animate-spin" />
              TC 1
            </p>
            <p className="flex place-items-center gap-x-2">
              <BsFillGearFill size={22} className="animate-spin" />
              TC 1
            </p>
            <p className="flex place-items-center gap-x-2">
              <BsFillGearFill size={22} className="animate-spin" />
              TC 1
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
