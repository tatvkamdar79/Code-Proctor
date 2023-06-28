import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import CodeExecutionPanel from "../components/CodeExecutionPanel";
import screenfull from "screenfull";
import axios from "axios";
import { baseURL } from "../config/config";
import submittingLoading from "../assets/submitTestLoading.gif";

const Test = () => {
  const { currentContestName, userHash } = useParams();
  const navigate = useNavigate();

  const { state } = useLocation();

  const contestantEmail = state?.email;
  const [totalTime, setTotalTime] = useState(0);
  const [selected, setSelected] = useState("ALL");
  const [questionsComponent, setQuestionsComponent] = useState([]);
  const [contest, setContest] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [submittingTest, setSubmittingTest] = useState(false);

  // The following details will be fetched from Api calls adn then stored in localStorgae until the durationof the exam
  const [questions, setQuestions] = useState([]);
  const [totalTimeForEachQuestion, setTotalTimeForEachQuestion] = useState([]);
  const [helperTimeVariable, setHelperTimeVariable] = useState(0);
  const [helperQuestionIndex, setHelperQuestionIndex] = useState(0);
  // const [contest, setContest] = useState({});

  if (!state || !state.validated || !state.email) {
    navigate(`/pretest/${currentContestName}/${userHash}`);
  }

  useEffect(() => {
    console.log("CONTEST CHANGED", contest);
  }, [contest]);

  useEffect(() => {
    if (
      localStorage.getItem("submittedTests") &&
      JSON.parse(localStorage.getItem("submittedTests")).includes(
        currentContestName
      )
    ) {
      navigate("/thank-you-for-taking-the-test", {
        state: { email: state?.email },
      });
    }
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      navigate("/thank-you-for-taking-the-test", {
        state: { email: state.email },
      });
    }
  }, [isSubmitted]);

  useEffect(() => {
    console.log(totalTimeForEachQuestion);
  }, [totalTimeForEachQuestion]);

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

  const handleSwitchTabSubmit = async () => {
    // debugger;
    setSubmittingTest(true);
    console.log(contest);
    const data = {
      route: "contests/submitTest",
      contestId: contest._id.$oid,
      contestantEmail: state.email,
    };
    try {
      const response = await axios.post(baseURL, data);
      console.log(response.data);
      if (response.data.status === 200) {
        setSubmittingTest(false);
        alert("Test submitted");
        setIsSubmitted(true);
        if (localStorage.getItem("submittedTests")) {
          let submittedTests = [
            ...JSON.parse(localStorage.getItem("submittedTests")),
            currentContestName,
          ];
          localStorage.setItem(
            "submittedTests",
            JSON.stringify(submittedTests)
          );
        } else {
          localStorage.setItem(
            "submittedTests",
            JSON.stringify([currentContestName])
          );
        }
      }
    } catch (err) {
      setSubmittingTest(false);
      console.log("Error while submitting", err);
    }
  };

  const handleFullscreenExit = async () => {
    // Perform actions when exiting full-screen mode
    console.log("Exitted full screen");
    if (window.confirm("DO NOT EXIT FULL SCREEN MODE")) {
      enterFullscreen();
    } else {
      if (window.confirm("FINAL WARNING!! YOUR TEST WILL BE SUBMITTED")) {
        enterFullscreen();
      } else {
        await handleSwitchTabSubmit();
        navigate("/thank-you-for-taking-the-test");
      }
    }
  };

  useEffect(() => {
    const handleVisibilityChange = async () => {
      // TODO UNCOMMENT THIS
      if (document.hidden) {
        if (localStorage.getItem("warning")) {
          if (Number(localStorage.getItem("warning")) > 1) {
            console.log("SWITCHED TAB", contest);
            setSubmittingTest(true);
            await handleSwitchTabSubmit();
            setSubmittingTest(false);
            navigate("/thank-you-for-taking-the-test");
            return;
          }
        } else {
          localStorage.setItem("warning", 0);
        }
        alert("PLEASE DO NOT SWITCH TABS! TEST WILL BE SUBMITTED!");
      } else {
        // Tab is now active
        console.log("Tab is now active");
        localStorage.setItem(
          "warning",
          Number(localStorage.getItem("warning")) + 1
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  });

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
    if (contest == null) {
      return;
    }
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
            contestantEmail={contestantEmail}
            contestId={contest._id.$oid}
            key={idx} // Add a unique key for each component
          />
        );
        idx += 1;
      }
      setQuestionsComponent(newQuestionsComponent);
    }
  }, [contest]);

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
      route: "contests/getContestDetails",
      contestName: currentContestName,
    };
    axios
      .post(baseURL, data)
      .then((response) => {
        console.log("RESPONSE", response);
        setContest(response.data.data.contest);

        let contestStartTime = response.data.data.contest.contestStartDate.sec;
        let contestEndTime = response.data.data.contest.contestEndDate.sec;

        contestStartTime = new Date(contestStartTime * 1000);
        contestEndTime = new Date(contestEndTime * 1000);

        console.log("HEROOOOOOOOOOOOOOOOOOOOOO");
        // contestStartTime;
        const now = new Date(Date.now());
        // now.setDate(now.getDate() + 1);
        now.setHours(now.getHours() + 5);
        now.setMinutes(now.getMinutes() + 30);
        // console.log(
        //   contestStartTime.toUTCString(),
        //   "\n",
        //   now.toUTCString(),
        //   "\n",
        //   contestEndTime.toUTCString(),
        //   "\n",
        //   (contestEndTime - contestStartTime) / 1000
        // );
        // console.log(
        //   contestStartTime.getTime() +
        //     "\n" +
        //     now.getTime() +
        //     "\n" +
        //     contestEndTime.getTime() +
        //     "\n" +
        //     (contestEndTime - contestStartTime) / 1000
        // );
        let timeLeft = (contestEndTime.getTime() - now.getTime()) / 1000;
        setTotalTime(timeLeft);
        console.log(timeLeft);
        // setTotalTime((contestEndTime.getTime() - Date.now()) / 1000);

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

  useEffect(() => {
    // Check if the browser supports getUserMedia (camera access)
    if (state && state.validated && state.email) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Get video stream from the camera
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(function (stream) {
            // Create a video element to display the camera feed
            let video = document.createElement("video");
            video.style.display = "none";
            video.srcObject = stream;
            video.autoplay = true;
            document.body.appendChild(video);

            // Create a canvas element to capture the photo
            let canvas = document.createElement("canvas");
            canvas.style.display = "none";
            document.body.appendChild(canvas);

            setCameraStream(stream);

            setTimeout(() => {
              // We can store the ID returned from setInterval and clear the interval later if we want.
              // Click Image every 5 seconds
              // TODO Uncomment in real project
              setInterval(() => {
                clickImageAndCheckIfUserIsCopying(canvas, video);
              }, 10000);
            }, 1000);
          })
          .catch(function (error) {
            console.error("Error accessing camera:", error);
          });
      } else {
        console.error("Camera access not supported by the browser");
      }
    }
    return () => {
      if (cameraStream && cameraStream.stop) {
        cameraStream.stop();
      }
    };
  }, []);

  const clickImageAndCheckIfUserIsCopying = async (canvas, video) => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame onto the canvas
    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the captured photo as a base64-encoded data URL
    let photoDataUrl = canvas.toDataURL("image/jpeg");
    console.log(photoDataUrl);

    const response = await sendImageToServer(photoDataUrl);
    console.log(response);
    const url = response.data.url;

    // const result = axios.post(baseURL, { route: 'tests/storeImage' });
    // Call this function after getting img link

    checkIfUserIsCopying(url);
  };

  // TODO: Add the test ID and user details for backend. Make changes in the backend accordingly.
  const sendImageToServer = async (base64Image) => {
    const result = await axios.post(
      baseURL,
      {
        base64Image: base64Image,
        route: `tests/storeImage`,
        email: contestantEmail,
      },
      { "Content-Type": "application/json" }
    );
    return result;
  };

  const checkIfUserIsCopying = (imgLink) => {
    let clientId = "2hqe6WNIjEoRhGdjwW4CwUJc";
    let clientSecret = "iMejT2OS6jjpcAuAUUHDr2JHMv4OeLDHG4aZC8pRBbOTfddS";
    const url = "https://api.everypixel.com/v1/keywords";
    const params = {
      /* your query parameters */
      url: imgLink,
    };
    console.log("Checking for user..", imgLink);
    axios
      .get(url, {
        params,
        auth: {
          username: clientId,
          password: clientSecret,
        },
      })
      .then((response) => {
        // Handle response
        const keywords = response.data.keywords;
        // "one person" & ! "mobile phone or smart phone"
        let isAlone = false,
          isMobilePresent = false;
        for (const keyword of keywords) {
          if (keyword.keyword === "one person") {
            isAlone = true;
          } else if (
            keyword.keyword === "mobile phone" ||
            keyword.keyword === "smart phone"
          ) {
            isMobilePresent = true;
            break;
          }
        }
        // Mark user as copying
        if (!isAlone || isMobilePresent) {
          // Send server request and mark as copy
          alert("You seem to be copying");
          const data = {
            contestId: contest?._id.$oid,
            contestantEmail,
            route: "contests/markUserCopying",
          };
          axios
            .post(baseURL, data)
            .then((response) => {})
            .catch((err) => console.log(err));
          navigate("/thank-you-for-taking-the-test");
        }
        console.log(keywords);
      })
      .catch((error) => {
        // Handle error
        console.log(error);
      });
  };

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
      <TestNavbar
        totalTime={totalTime}
        setTotalTime={setTotalTime}
        selected={selected}
        setSelected={setSelected}
        questions={questions}
        handleSubmit={handleSwitchTabSubmit}
      />

      {contest &&
        selected === "ALL" &&
        ViewAllQuestionsList(
          questions,
          setSelected,
          contest._id.$oid,
          state.email,
          setIsSubmitted,
          submittingTest,
          setSubmittingTest,
          currentContestName
        )}

      {selected === "INSTRUCTIONS" && TestInstructions(allInstructions)}

      {questionsComponent.map((component, idx) => {
        if (selected === idx) {
          return component;
        }
      })}
    </div>
  );
};

const TestNavbar = ({
  totalTime,
  setTotalTime,
  selected,
  setSelected,
  questions,
  handleSubmit,
}) => {
  const [showTime, setShowTime] = useState(true);
  const [remainingTime, setRemainingTime] = useState(1800);
  const [timeBasedColor, setTimeBasedColor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleTimeUpSubmit = async () => {
    alert("Time Up. Your Test Will Be Submitted");
    await handleSubmit();
  };

  const remTime = (seconds) => {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;

    var formattedTime =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      remainingSeconds.toString().padStart(2, "0");

    return formattedTime;
  };

  useEffect(() => {
    console.log("RT", remTime(remainingTime));
    // console.log("RT", mins, seconds);
    if (!submitting && remainingTime <= 1) {
      handleTimeUpSubmit();
      setSubmitting(true);
    }
  }, [remainingTime]);

  useEffect(() => {
    if (totalTime === 0) {
      return;
    }
    setRemainingTime(Math.round(totalTime));
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [totalTime]);

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

const ViewAllQuestionsList = (
  questions,
  setSelected,
  contestId,
  contestantEmail,
  setIsSubmitted,
  submittingTest,
  setSubmittingTest,
  currentContestName
) => {
  const handleSubmit = async () => {
    setSubmittingTest(true);
    const data = {
      route: "contests/submitTest",
      contestId,
      contestantEmail,
    };
    try {
      const response = await axios.post(baseURL, data);
      console.log(response.data);
      if (response.data.status === 200) {
        setSubmittingTest(false);
        alert("Test submitted");
        setIsSubmitted(true);
        if (localStorage.getItem("submittedTests")) {
          let submittedTests = [
            ...JSON.parse(localStorage.getItem("submittedTests")),
            currentContestName,
          ];
          localStorage.setItem(
            "submittedTests",
            JSON.stringify(submittedTests)
          );
        } else {
          localStorage.setItem(
            "submittedTests",
            JSON.stringify([currentContestName])
          );
        }
      }
    } catch (err) {
      setSubmittingTest(false);
      console.log("Error while submitting", err);
    }
  };
  return (
    <section className="w-full h-full flex flex-col place-items-center border gap-y-4 bg-[#f3f7f7] overflow-y-scroll py-10 ">
      <div
        className={`w-[92%] flex place-items-center px-4 text-[13px] text-gray-500 font-semibold ${
          submittingTest && "blur-[2px]"
        }`}
      >
        <p className="px-2 w-[55%]">QUESTIONS</p>
        <p className="px-2 w-[22.5%]">TYPE</p>
        <p className="px-2 w-[22.5%]">ACTION</p>
      </div>
      {questions.map(({ title }, index) => (
        <div
          key={index}
          className={`w-[92%] flex flex-col justify-center mx-auto px-4 bg-white border border-gray-300 text-lg shadow-sm shadow-gray-300 hover:scale-105 transition-all duration-300 ${
            submittingTest && "blur-[4px]"
          }`}
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
      <div className="w-5/6 flex justify-end py-10">
        <button
          onClick={handleSubmit}
          className="w-56 h-16 bg-green-600 text-xl text-white font-sans font-semibold shadow-md shadow-green-400 hover:scale-110 rounded-md transition-all duration-300"
        >
          Submit
        </button>
      </div>
      {submittingTest && (
        <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center place-items-center">
          <img src={submittingLoading} alt="" />
          <p className="text-xl font-mono font-semibold text-green-800 animate-bounce">
            <span className="animate-pulse">
              Hold on! We are submitting your test...
            </span>
          </p>
        </div>
      )}
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
