import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import Chart from "react-apexcharts";
import { MdOutlineMarkEmailUnread, MdAccessTime } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { BsCheckAll, BsCheckSquareFill } from "react-icons/bs";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const IndividualContestProgressReport = ({ setOpen, candidateData }) => {
  const [selected, setSelected] = useState(null);
  const [hoveringOverQuestionIndex, setHoveringOverQuestionIndex] = useState();
  const [hoveredText, setHoveredText] = useState("");
  const viewCodeRef = useRef(null);

  useEffect(() => {
    if (selected !== null && viewCodeRef.current) {
      viewCodeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected]);

  const totalQuestions = candidateData.questions.length;
  const questionNames = candidateData.questions.map(
    (question) => question.questionName
  );
  const timeTakenQuestionWise = candidateData.questions.map((question) => {
    return Math.round(question.timeSpentOnQuestion);
  });

  const chartOptions = {
    labels: questionNames,
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "10px",
              fontFamily: "Arial, sans-serif",
              color: "#fffff",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "20px",
              fontFamily: "Arial, sans-serif",
              color: "#ffffff",
              offsetY: 16,
              formatter: function (val) {
                return val / (1000 * 60) + " mins";
              },
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "15px",
              fontFamily: "Arial, sans-serif",
              color: "#ffffff",
              offsetY: 0,
              formatter: function () {
                // Custom formatter for the "Total" field
                return candidateData.totalTime / (60 * 1000) + " mins";
              },
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "left",
      floating: false,
      offsetY: 10,
      offsetX: 0,
      markers: {
        width: 30,
        height: 12,
        strokeWidth: 1,
      },
      labels: {
        colors: ["#ffffff"],
      },
    },
    colors: ["#f4662a", "#51C9B7", "#FE4773", "#9C27B0", "#0026FF", "#FCD437"],
    tooltip: {
      y: {
        formatter: function (value, { seriesIndex, dataPointIndex }) {
          return value + " mins";
        },
      },
    },
    chart: {
      events: {
        dataPointMouseEnter: function (event, chartContext, config) {
          const { seriesIndex, dataPointIndex } = config;
          const timeSpent = timeTakenQuestionWise[dataPointIndex];
          setHoveringOverQuestionIndex(dataPointIndex);
          setHoveredText(timeSpent + " mins");
        },
        dataPointMouseLeave: function (event, chartContext, config) {
          setHoveredText("");
          setHoveringOverQuestionIndex("");
        },
      },
    },
  };

  const chartSeries = timeTakenQuestionWise;
  console.log(typeof chartSeries, chartSeries);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full min-w-[1901px] bg-black bg-opacity-20">
      <section className="place-self-center justify-self-center w-4/5 bg-gray-200 h-5/6 flex mx-auto my-auto rounded-3xl shadow-xl shadow-gray-500 overflow-hidden relative border-2 border-gray-100 mt-[6.5vh]">
        <div
          className="absolute right-0 p-2 border-2 border-t-0 border-r-0 border-gray-300 shadow-md shadow-gray-300 rounded-bl-2xl bg-green-400"
          onClick={() => setOpen(false)}
        >
          <IoClose
            size={35}
            className="hover:scale-150 transition-all duration-300 cursor-pointer"
          />
        </div>
        <div className="flex flex-col w-1/3 border-r-4 border-green-600 bg-neutral-900 text-white overflow-hidden py-5 gap-y-5">
          <p className="flex justify-start place-items-center font-mono font-semibold w-5/6 mx-auto text-xl underline underline-offset-2">
            Time Analysis
          </p>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width={420}
            height={400}
          />
          <div className="w-5/6 mx-auto">
            <p className="font-medium text-xl underline">Basic Details</p>
            <div className="flex flex-col gap-y-1 mx-2">
              <p className="flex text-lg font-semibold place-items-center text-md gap-x-2 border-b border-gray-500">
                <FiUser size={25} />
                {candidateData.name}
              </p>
              <p className="flex text-lg font-semibold place-items-center text-md gap-x-2 border-b border-gray-500">
                <MdOutlineMarkEmailUnread size={25} />
                {candidateData.email}
              </p>
              <p className="flex text-lg font-semibold place-items-center text-md gap-x-2 border-b border-gray-500">
                <MdAccessTime size={25} />
                {candidateData.totalTime / (1000 * 60)} mins
              </p>
              <p className="flex text-lg font-semibold place-items-center text-md gap-x-2 border-b border-gray-500">
                <BsCheckAll size={27} className="text-white" />
                {candidateData.questionsSolved} / {totalQuestions}
              </p>
            </div>
          </div>
        </div>
        <div className="w-2/3 bg-gray-50 p-5 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <p className="text-3xl font-semibold font-mono text-orange-500">
            Statistics
          </p>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-lg font-semibold font-mono border-2 border-cyan-500">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold font-mono border-2 border-cyan-500">
                  Time per Question
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold font-mono border-2 border-cyan-500">
                  Correct Submissions
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold font-mono border-2 border-cyan-500">
                  Incorrect Submissions
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold font-mono border-2 border-teal-400">
                  Test Cases Passed
                </th>{" "}
                <th className="px-6 py-3 text-left text-lg font-semibold font-mono border-2 border-teal-400">
                  Code Execution Time
                </th>
              </tr>
            </thead>
            <tbody>
              {candidateData.questions.map((question, index) => (
                <tr
                  key={index}
                  className={`${
                    hoveringOverQuestionIndex === index &&
                    "bg-green-300 scale-[101%] transition-all duration-300"
                  }`}
                >
                  <td className="font-semibold text-lg font-mono px-6 py-4 border-2 border-green-500 border-t-0">
                    <div className="w-full flex flex-col">
                      <div className="flex">
                        <span className="w-6">{index + 1}.</span>
                        <p>{question.questionName}</p>
                      </div>
                      <button
                        className={`text-sm text-gray-100 rounded-md p-1 outline-none hover:scale-110 hover:bg-green-600 transition-all duration-300 shadow-lg shadow-gray-300 ${
                          selected === index ? "bg-green-600" : "bg-stone-900"
                        }`}
                        onClick={() => {
                          if (selected === index) {
                            setSelected(null);
                          } else {
                            setSelected(index);
                          }
                        }}
                      >
                        {selected === index ? "Hide Code" : "View Code"}
                      </button>
                    </div>
                  </td>
                  <td className="font-semibold text-lg font-mono px-6 py-4 border-2 border-green-500 border-t-0">
                    {Math.round(question.timeSpentOnQuestion / (1000 * 60))}{" "}
                    mins
                  </td>
                  <td className="font-semibold text-lg font-mono px-6 py-4 border-2 border-green-500 border-t-0">
                    {question.correctSubmissions}
                  </td>
                  <td className="font-semibold text-lg font-mono px-6 py-4 border-2 border-green-500 border-t-0">
                    {question.incorrectSubmissions}
                  </td>
                  <td className="font-semibold text-lg font-mono px-6 py-4 border-2 border-green-500 border-t-0">
                    {question.testCasesPassed} / {question.totalTestCases}
                  </td>{" "}
                  <td className="font-semibold text-lg font-mono px-6 py-4 border-2 border-green-500 border-t-0">
                    {question.codeExecutionTime} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selected !== null && (
            <>
              <p
                ref={viewCodeRef}
                className="mt-4 mb-1 text-3xl font-semibold underline"
              >
                Code
              </p>
              <AceEditor
                mode={candidateData.questions[selected].language}
                theme="monokai"
                value={candidateData.questions[selected].code}
                readOnly={true}
                editorProps={{ $blockScrolling: true }}
                style={{ height: "300px", width: "100%" }}
                fontSize={18}
              />
            </>
          )}
        </div>
      </section>
      <div className="w-2/3 mx-auto mt-5 text-center">
        <p className="text-xl font-semibold">{hoveredText}</p>
      </div>
    </div>
  );
};

export default IndividualContestProgressReport;
