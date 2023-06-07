import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import { languageToEditorMode } from "../config/mappings";
import API from "../utils/API";
import axios from "axios";
import { baseURL, PHP_SERVER_URL } from "../config/config";
import Peer from "peerjs";
import { diff_match_patch } from "diff-match-patch";
import { Resizable } from "re-resizable";
import { GrDrag } from "react-icons/gr";

const CodeExecutionPanel = ({
  question,
  time,
  setTime,
  index,
  setIndex,
  contestId,
}) => {
  const [timeSpent, setTimeSpent] = useState(Date.now());
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [widthLeft, setWidthLeft] = useState("60vw");
  const [widthRight, setWidthRight] = useState("38.5vw");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const languages = Object.keys(languageToEditorMode);
  const fontSizes = [
    "8",
    "10",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22",
    "24",
    "26",
    "28",
    "30",
    "32",
  ];
  const themes = [
    "monokai",
    "github",
    "solarized_dark",
    "dracula",
    "eclipse",
    "tomorrow_night",
    "tomorrow_night_blue",
    "xcode",
    "ambiance",
    "solarized_light",
  ].sort();

  const [language, setLanguage] = useState(
    localStorage.getItem("language") ?? "javascript"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ?? "monokai"
  );
  const [fontSize, setFontSize] = useState(
    localStorage.getItem("fontSize") ?? "12"
  );

  const idleStatus = "Idle";
  const runningStatus = "running";
  const compeletedStatus = "completed";
  const errorStatus = "Some error occured";

  const [submissionStatus, setSubmissionStatus] = useState(idleStatus);
  const [submissionId, setSubmissionId] = useState("");

  const [submissionCheckerId, setSubmissionCheckerId] = useState(null);

  const [submissionIdsForTCs, setSubmissionIdsForTCs] = useState([]);
  const [submissionStatusForTCs, setSubmissionStatusForTCs] = useState([]);

  const [inAudio, setInAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const dmp = new diff_match_patch();

  useEffect(() => {
    // console.log(question.title, time);
    return () => {
      console.log("Printing from ", index + 1);
      console.log(index, Date.now() - timeSpent, time[index]);
      setTime(Date.now() - timeSpent);
      setIndex(index);
    };
  }, []);

  useEffect(() => {
    const resizeCallback = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

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
      let index = 0,
        score = 0;
      for (let res of responses) {
        const { stdout, stderr, build_stderr } = res.data;
        let output = "";
        if (stdout) output += stdout;
        if (question.outputs[index] === output) {
          score += 1;
        }
        console.log(output, question.outputs[index]);
        index += 1;
      }
      setSubmissionStatusForTCs([]);
    };
    let isCompleted =
      submissionStatusForTCs.filter((status) => status !== compeletedStatus)
        .length === 0;
    if (submissionCheckerId && isCompleted) {
      clearInterval(submissionCheckerId);
      setSubmissionCheckerId(null);
      helper();
    }
  }, [submissionStatusForTCs]);

  useEffect(() => {
    if (submissionCheckerId && submissionStatus === compeletedStatus) {
      clearInterval(submissionCheckerId);
      setSubmissionCheckerId(null);

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

  const createSubmissionRunners = async () => {
    let params = {
      source_code: body,
      language: language,
      input: "",
      api_key: "guest",
    };
    let responses = [];
    for (let input of question.inputs) {
      responses.push(
        axios.post(`https://api.paiza.io/runners/create`, {
          ...params,
          input: input,
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

  const handleSubmitAllTestCases = () => {
    if (submissionStatusForTCs.length > 0) return;
    setSubmissionStatusForTCs(["running"]);
    createSubmissionRunners();
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

  const handleSubmit = () => {
    if (submissionStatus === runningStatus) return;
    setSubmissionStatus(runningStatus);

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
        setSubmissionStatus(errorStatus);
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

  const handleWidthChange = (x) => {
    setWidthRight((100 - x).toString());
    setWidthLeft(x.toString());
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // TODO: Send Image to server.
  useEffect(() => {
    // Check if the browser supports getUserMedia (camera access)
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

          setTimeout(() => {
            // We can store the ID returned from setInterval and clear the interval later if we want.
            // Click Image every 5 seconds
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
  }, []);

  const clickImageAndCheckIfUserIsCopying = async (canvas, video) => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame onto the canvas
    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the captured photo as a base64-encoded data URL
    let photoDataUrl = canvas.toDataURL("image/jpeg");
    // console.log(photoDataUrl.length);

    // Do something with the photo data, e.g., display it on the page or send it to a server

    // TODO: Resolve cors error and get the image link from the server

    // const response = await sendImageToServer(photoDataUrl);
    // console.log(response);
    // const url = response.data.url;

    // const result = axios.post(baseURL, { route: 'tests/storeImage' });
    // Call this function after getting img link

    // checkIfUserIsCopying(url);
  };

  // TODO: Add the test ID and user details for backend. Make changes in the backend accordingly.
  const sendImageToServer = async (base64Image) => {
    const result = await axios.post(
      baseURL,
      {
        base64Image: base64Image,
        route: `/tests/storeImage`,
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
        } else {
          // Everything is fine
        }
        console.log(keywords);
      })
      .catch((error) => {
        // Handle error
        console.log(error);
      });
  };

  const handleUpdateBody = (value) => {
    const patch = dmp.patch_make(body, value);
    setBody(value);
    console.log(value);
    // debounce(() => socket.emit('updateBody', { value: patch, roomId: id }), 100)();
  };

  const handleUpdateInput = (value) => {
    const patch = dmp.patch_make(input, value);
    setInput(value);
    // debounce(() => socket.emit('updateInput', { value: patch, roomId: id }), 100)();
  };
  const [questionWidth, setQuestionWidth] = useState(window.outerWidth * 0.5);
  const [editorWidth, setEditorWidth] = useState("100%");
  return (
    <div className="flex w-full h-screen overflow-y-scroll">
      <Resizable
        minWidth={100}
        maxWidth={window.outerWidth * (3 / 5)}
        minHeight={"100vh"}
        onResize={(e, direction, ele, diff) => {
          //   console.log(diff, ele);
          let changeInWidth = diff;
          setQuestionWidth((questionWidth) => questionWidth + changeInWidth);
          setEditorWidth((editorWidth) => editorWidth - changeInWidth);
          //   console.log(e);
          //   console.log(e.pageX);
        }}
        enable={{
          right: true,
          left: false,
          top: false,
          bottom: false,
          topRight: false,
          topLeft: false,
          bottomLeft: false,
          bottomRight: false,
        }}
        className
      >
        <div className="flex overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div
            className="h-screen w-full flex flex-col px-3 bg-[#f3f7f7] py-5 gap-y-7"
            id="question"
          >
            <section>
              <p className="text-3xl text-gray-800 font-semibold border-b-2 border-gray-300 pb-3 mb-5">
                {1}. {question.title}
              </p>
            </section>

            <section>
              <p className="font-normal text-gray-500">
                {question.problemStatement}
              </p>
            </section>

            <section>
              <p className="text-xl font-semibold text-gray-800">
                Constraints :
              </p>
              <ul className="flex flex-col gap-y-1 italic pl-8 text-gray-600 list-disc">
                {question.constraints.map((constraint, index) => {
                  {
                    return React.createElement("li", {
                      dangerouslySetInnerHTML: { __html: constraint },
                      key: index,
                    });
                  }
                })}
              </ul>
            </section>

            <section className="flex flex-col gap-y-8 text-gray-800">
              {question.sampleTestCases.map(({ input, output }, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-y-2 border-b border-gray-400 pb-4"
                >
                  <p className="text-lg font-medium">
                    Sample Input {index + 1} :
                  </p>
                  <div className="bg-white p-4 shadow-sm text-gray-800">
                    {input.split("\n").map((line, innerIndex) => (
                      <p key={innerIndex}>{line}</p>
                    ))}
                  </div>
                  <p className="text-lg font-medium">
                    Sample Output{index + 1} :
                  </p>
                  <div className="bg-white p-4 shadow-sm text-gray-800">
                    <p>{output}</p>
                  </div>
                </div>
              ))}
            </section>
          </div>
          <div className="flex flex-col h-screen w-3 place-items-center text-center justify-center bg-gray-200 hover:bg-gray-300">
            <GrDrag />
            <GrDrag />
            <GrDrag />
            <GrDrag />
          </div>
        </div>
      </Resizable>
      <Editor
        theme={theme}
        width={editorWidth}
        height={"100vh"}
        language={languageToEditorMode[language]}
        body={body}
        setBody={handleUpdateBody}
        fontSize={fontSize}
        output={output}
        setOutput={setOutput}
        questionId={question}
        contestId={contestId}
      >
        <div className="flex justify-start gap-x-10 py-2 px-5">
          <div className="flex justify-center place-items-center gap-x-2">
            <label>Language</label>
            <select
              className="bg-white border border-gray-300 w-32 py-1"
              defaultValue={language}
              onChange={(event) => {
                setLanguage(event.target.value);
              }}
            >
              {languages.map((lang, index) => {
                return (
                  <option key={index} value={lang} selected={lang === language}>
                    {lang}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex justify-center place-items-center gap-x-2">
            <label>Theme</label>
            <select
              className="bg-white border border-gray-300 w-32 py-1"
              defaultValue={theme}
              onChange={(event) => setTheme(event.target.value)}
            >
              {themes.map((theme, index) => {
                return (
                  <option key={index} value={theme}>
                    {theme}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex justify-center place-items-center gap-x-2">
            <label>Font Size</label>
            <select
              className="bg-white border border-gray-300 w-32 py-1"
              defaultValue={fontSize}
              onChange={(event) => setFontSize(event.target.value)}
            >
              {fontSizes.map((fontSize, index) => {
                return (
                  <option key={index} value={fontSize}>
                    {fontSize}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </Editor>
    </div>
  );
};

export default CodeExecutionPanel;
