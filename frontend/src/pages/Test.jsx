import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import CodeExecutionPanel from "../components/CodeExecutionPanel";
import screenfull from "screenfull";
import axios from "axios";
import { baseURL } from "../config/config";

const Test = () => {
  const { currentContestName } = useParams();
  const navigate = useNavigate();

  const { state } = useLocation();
  console.log(state);
  if (!state || !state.validated) {
    navigate(`/pretest/${currentContestName}`);
  }

  const totalTime = 1800;
  const [selected, setSelected] = useState("ALL");
  const [questionsComponent, setQuestionsComponent] = useState([]);
  const [contest, setContest] = useState(null);

  // The following details will be fetched from Api calls adn then stored in localStorgae until the durationof the exam
  const [questions, setQuestions] = useState([]);
  const [totalTimeForEachQuestion, setTotalTimeForEachQuestion] = useState([]);
  const [helperTimeVariable, setHelperTimeVariable] = useState(0);
  const [helperQuestionIndex, setHelperQuestionIndex] = useState(0);

  // Remove this
  const staticQuestions = [
    {
      title: "Title of the question 1",
      problemStatement:
        "Given an unsorted array of n elements, find if the element k is present in the array or not.",
      constraints: [
        "1 &le; arr &le; 100",
        "1 &ge; n &le; 300",
        "minNumberOfTurns &le; 6*10<sup>5</sup>",
      ],
      sampleTestCases: [
        { input: "1\n2\n3", output: "6" },
        { input: "1\n2\n3", output: "6" },
        { input: "1\n2\n3", output: "6" },
      ],
      inputs: ["1", "2", "3"],
      outputs: ["1", "2", "3"],
    },
    {
      title: "Title of the question 2",
      problemStatement:
        "Given an unsorted array of n elements, find if the element k is present in the array or not.",
      constraints: [
        "1 &le; arr &le; 100",
        "1 &ge; n &le; 300",
        "minNumberOfTurns &le; 6*10<sup>5</sup>",
      ],
      sampleTestCases: [
        { input: "1\n2\n3", output: "6" },
        { input: "1\n2\n3", output: "6" },
        { input: "1\n2\n3", output: "6" },
      ],
      inputs: ["1", "2", "3"],
      outputs: ["1", "2", "3"],
    },
    {
      title: "Title of the question 3",
      problemStatement:
        "Given an unsorted array of n elements, find if the element k is present in the array or not.",
      constraints: [
        "1 &le; arr &le; 100",
        "1 &ge; n &le; 300",
        "minNumberOfTurns &le; 6*10<sup>5</sup>",
      ],
      sampleTestCases: [
        { input: "1\n2\n3", output: "6" },
        { input: "1\n2\n3", output: "6" },
        { input: "1\n2\n3", output: "6" },
      ],
      inputs: ["1", "2", "3"],
      outputs: ["1", "2", "3"],
    },
    {
      title: "Title of the question 4",
      problemStatement:
        "Given an unsorted array of n elements, find if the element k is present in the array or not.",
      constraints: [
        "1 &le; arr &le; 100",
        "1 &ge; n &le; 300",
        "minNumberOfTurns &le; 6*10<sup>5</sup>",
      ],
      sampleTestCases: [
        { input: "1\n2\n3", output: "6" },
        { input: "1\n2\n3", output: "6" },
        { input: "1\n2\n3", output: "6" },
      ],
      inputs: ["1", "2", "3"],
      outputs: ["1", "2", "3"],
    },
  ];

  const allInstructions = [
    {
      instructionType: "General Instructions",
      instructions: [
        "Instruction 1 hain ye bhai isko follow karna mat bhoolna!",
        "Instruction 2 hain ye bhai isko follow karna mat bhoolna warna disqualify hojaoge!",
        "Instruction 3 hain ye bhai isko follow karna mat bhoolna warna job nahi milegi!",
        "Instruction nahi hain ye bhai, sirf 'All The Best' bolna tha!",
      ],
    },
    {
      instructionType: "Proctoring Instructions",
      instructions: [
        "Find a quiet and well-lit room where you can focus without distractions.",
        "Close all unnecessary applications, browser tabs, and programs on your computer.",
        "Make sure your computer is fully charged or connected to a power source.",
        "Ensure a stable internet connection for the duration of the assessment.",
      ],
    },
  ];

  const question = {
    title: "Title of the question",
    problemStatement:
      "Given an unsorted array of n elements, find if the element k is present in the array or not.",
    constraints: [
      "1 &le; arr &le; 100",
      "1 &ge; n &le; 300",
      "minNumberOfTurns &le; 6*10<sup>5</sup>",
    ],
    sampleTestCases: [
      { input: "1\n2\n3", output: "6" },
      { input: "1\n2\n3", output: "6" },
      { input: "1\n2\n3", output: "6" },
    ],
    inputs: ["1", "2", "3"],
    outputs: ["1", "2", "3"],
  };

  const enterFullscreen = () => {
    if (screenfull.isEnabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    }
  };

  const handleFullscreenExit = () => {
    // Perform actions when exiting full-screen mode
    console.log("Exitted full screen");
    if (window.confirm("DO NOT EXIT FULL SCREEN MODE")) {
      enterFullscreen();
    } else {
      if (window.confirm("FINAL WARNING!! YOUR TEST WILL BE SUBMITTED")) {
        enterFullscreen();
      } else {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      // TODO UNCOMMENT THIS
      // if (document.hidden) {
      //   // Tab is now inactive
      //   alert("PLEASE DO NOT SWITCH TABS!");
      // } else {
      //   // Tab is now active
      //   console.log("Tab is now active");
      // }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleExit = () => {
      if (!screenfull.isFullscreen) {
        handleFullscreenExit();
      }
    };

    screenfull.on("change", handleExit);

    return () => {
      screenfull.off("change", handleExit);
    };
  }, []);

  useEffect(() => {
    console.log("From questions useEffect", questions);
    if (questions !== []) {
      let newQuestionsComponent = [];
      let idx = 0;
      for (let question of questions) {
        newQuestionsComponent.push(
          <CodeExecutionPanel
            question={question}
            time={totalTimeForEachQuestion}
            index={idx}
            setTime={setHelperTimeVariable}
            setIndex={setHelperQuestionIndex}
          />
        );
        idx += 1;
      }
      setQuestionsComponent(newQuestionsComponent);
    }
  }, [questions]);

  useEffect(() => {
    let newTimeState = [...totalTimeForEachQuestion];
    newTimeState[helperQuestionIndex] += helperTimeVariable;
    setTotalTimeForEachQuestion(newTimeState);
  }, [helperTimeVariable, helperQuestionIndex]);

  useEffect(() => {
    console.log(totalTimeForEachQuestion);
  }, [totalTimeForEachQuestion]);

  useEffect(() => {
    let initialTimeState = [];

    // TODO: Fetch the questions from API call
    const data = {
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1MjE1ODV9.3-O-JVP8eaYRPtXo0q8pTDc3HY3sN91PXDGPmrbqsDo",
      route: "contests/getContestDetails",
      contestName: currentContestName,
    };
    axios
      .post(baseURL, data)
      .then((response) => {
        setContest(response.data.data.contest);
        setQuestions(response.data.data.contest.questions);
        console.log(response.data);
        const questionsForContest = response.data.data.contest.questions;
        for (let question of questionsForContest) {
          initialTimeState.push(0);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // setQuestions(questionsForContest);
    setTotalTimeForEachQuestion(initialTimeState);
  }, []);

  useEffect(() => {
    // console.log("Time changed", totalTimeForEachQuestion);
  }, [totalTimeForEachQuestion]);

  const fetchIpAddress = async () => {
    try {
      const response = await axios.get("https://api.ipify.org/?format=json");
      const ipAddress = response.data.ip;
      console.log("IP-ADDRESS: ", ipAddress);
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  };

  useEffect(() => {
    fetchIpAddress();
  }, []);

  return (
    <div className="flex h-screen" id="test">
      {/* <button onClick={enterFullscreen} id="fs">
        Enter Full Screen
      </button> */}
      {/* TEST NAVBAR */}
      {TestNavbar({ totalTime, selected, setSelected, questions })}

      {selected === "ALL" && ViewAllQuestionsList(questions, setSelected)}

      {selected === "INSTRUCTIONS" && TestInstructions(allInstructions)}

      {questionsComponent.map((component, idx) => {
        if (selected === idx) {
          return component;
        }
      })}
    </div>
  );
};

const TestNavbar = ({ totalTime, selected, setSelected, questions }) => {
  const [showTime, setShowTime] = useState(true);
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const [timeBasedColor, setTimeBasedColor] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const percentage = (remainingTime / totalTime) * 100;

    // Calculate the RGB values for the gradient
    const red = 255 - Math.round((255 * percentage) / 100);
    const green = Math.round((255 * percentage) / 100);

    const color = `rgb(${red}, ${green}, ${(red + green) * 0.4})`;

    setTimeBasedColor(color);
  }, [remainingTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <section className="border w-20 bg-[#e7eeef]">
      <ul className="flex flex-col justify-center place-items-center font-semibold font-serif text-black">
        <li
          className={`w-full h-14 flex justify-center place-items-center text-center text-white`}
          style={{ backgroundColor: timeBasedColor }}
          onClick={() => setShowTime((showTime) => !showTime)}
        >
          {showTime ? formatTime(remainingTime) : "Show Timer"}
        </li>
        <li
          className={`w-full h-14 flex place-items-center justify-center cursor-pointer ${
            selected === "ALL" && "bg-[#f3f7f7] border-l-[4px] border-[#0a7bbf]"
          }`}
          onClick={() => setSelected("ALL")}
        >
          ALL
        </li>
        <li
          className={`w-full h-14 flex place-items-center justify-center cursor-pointer ${
            selected === "INSTRUCTIONS" &&
            "bg-[#f3f7f7] border-l-[4px] border-[#0a7bbf]"
          }`}
          onClick={() => setSelected("INSTRUCTIONS")}
        >
          <AiOutlineInfoCircle size={25} />
        </li>
        {questions.map((question, index) => (
          <li
            key={index}
            className={`w-full h-14 flex place-items-center justify-center cursor-pointer ${
              selected === index &&
              "bg-[#f3f7f7] border-l-[4px] border-[#0a7bbf]"
            }`}
            onClick={() => setSelected(index)}
          >
            {index + 1}
          </li>
        ))}
      </ul>
    </section>
  );
};

const ViewAllQuestionsList = (questions, setSelected) => {
  return (
    <section className="w-full h-full flex flex-col place-items-center border gap-y-4 bg-[#f3f7f7] overflow-y-scroll py-10">
      <div className="w-[92%] flex place-items-center px-4 text-[13px] text-gray-500 font-semibold">
        <p className="px-2 w-[55%]">QUESTIONS</p>
        <p className="px-2 w-[22.5%]">TYPE</p>
        <p className="px-2 w-[22.5%]">ACTION</p>
      </div>
      {questions.map(({ title }, index) => (
        <div
          key={index}
          className="w-[92%] flex flex-col justify-center mx-auto px-4 bg-white border border-gray-300 text-lg shadow-sm shadow-gray-300 hover:scale-105 transition-all duration-300"
        >
          <div className="flex place-items-center h-[90px]">
            <p className="w-[55%] font-semibold font-sans">
              {index + 1}. {title}
            </p>
            <p className="w-[25%] font-light text-sm">{"coding"}</p>
            <p className="w-[20%]">
              <button
                onClick={() => setSelected(index)}
                className="w-32 h-10 bg-[#3c812e] text-white font-sans font-semibold shadow-lg shadow-green-200 text-sm"
              >
                Solve
              </button>
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

const TestInstructions = (allInstructions) => {
  return (
    <section className="w-full h-full flex flex-col place-items-center border gap-y-4 bg-[#f3f7f7] overflow-y-scroll font-mono py-10">
      <ul className="flex flex-col w-11/12 gap-y-10">
        {allInstructions.map(({ instructionType, instructions }, index) => (
          <li
            key={index}
            className="flex flex-col justify-evenly gap-y-4 border border-gray-300 p-6 bg-slate-100 shadow-lg shadow-gray-300"
            style={{ minHeight: "224px" }}
          >
            <p className="w-full mx-auto text-5xl font-semibold">
              {instructionType}
            </p>
            <ul className="w-[95%] mx-auto flex flex-col gap-y-2 font-semibold text-sky-900">
              {instructions.map((instruction, innerIndex) => (
                <li key={innerIndex} className="flex gap-x-1">
                  <span>{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Test;
