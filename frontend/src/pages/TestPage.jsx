import React, { useEffect, useState } from "react";
import Editor from "../components/Editor";
import { languageToEditorMode } from "../config/mappings";
import API from "../utils/API";
import axios from "axios";
import { baseURL, PHP_SERVER_URL } from "../config/config";
import Peer from "peerjs";
import { diff_match_patch } from "diff-match-patch";
import { Resizable } from "re-resizable";
import { FaGripVertical } from "react-icons/fa";

const TestPage = () => {
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

  // Question
  const question = {
    title: "Title of the question",
    statement: "This is problem statement Blah Blah",
    sampleInputs: ["Inp 1"],
    sampleOutputs: ["Output 1"],
    inputs: ["1", "2", "3"],
    outputs: ["1", "2", "3"],
  };

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
        if (question.outputs[index] == output) {
          score += 1;
        }
        console.log(output, question.outputs[index]);
        index += 1;
      }
      setSubmissionStatusForTCs([]);
    };
    let isCompleted =
      submissionStatusForTCs.filter((status) => status != compeletedStatus)
        .length == 0;
    if (submissionCheckerId && isCompleted) {
      clearInterval(submissionCheckerId);
      setSubmissionCheckerId(null);
      helper();
    }
  }, [submissionStatusForTCs]);

  useEffect(() => {
    if (submissionCheckerId && submissionStatus == compeletedStatus) {
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
    console.log(photoDataUrl.length);

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
          if (keyword.keyword == "one person") {
            isAlone = true;
          } else if (
            keyword.keyword == "mobile phone" ||
            keyword.keyword == "smart phone"
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

  return (
    <div>
      <div className="w-full mx-auto px-4">
        <p className="border rounded text-3xl">{question.title}</p>
        <br />
        <p className="text-2xl mx-4">{question.statement}</p>
        <br />
        {question.sampleInputs.map((inp, idx) => {
          return (
            <div key={idx} className="mx-4">
              <h3>Sample Input {idx + 1}:</h3>
              <p className="mx-3">{inp}</p>
              <br />
              <h3>Sample Output {idx + 1}:</h3>
              <p className="mx-3">{question.sampleOutputs[idx]}</p>
              <br />
            </div>
          );
        })}
        {question.sampleInputs.length === 0 && (
          <div className="mx-4">
            <h3>Sample Input:</h3>
            <p className="mx-3">No sample input provided</p>
            <br />
            <h3>Sample Output:</h3>
            <p className="mx-3">No sample output provided</p>
            <br />
          </div>
        )}
      </div>
      <div className="flex justify-between mx-auto w-11/12">
        <div className="w-2/3 flex place-items-center justify-between py-2 px-10">
          <div>
            <label>Choose Language</label>
            <select
              className="bg-white border border-gray-300 rounded-md py-2 px-4"
              defaultValue={language}
              onChange={(event) => {
                setLanguage(event.target.value);
              }}
            >
              {languages.map((lang, index) => {
                return (
                  <option key={index} value={lang} selected={lang == language}>
                    {lang}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label>Choose Theme</label>
            <select
              className="bg-white border border-gray-300 rounded-md py-2 px-4"
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
          <div>
            <label>Font Size</label>
            <select
              className="bg-white border border-gray-300 rounded-md py-2 px-4"
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
          {/* <div className="form-group col-lg-2 col-md-3">
          <br />
          <button
            className="btn btn-secondary"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            Copy room link
          </button>
        </div> */}
          {/* <div className="form-group col-lg-2 col-md-2">
          <br />
          <button
            className={`btn btn-${inAudio ? "primary" : "secondary"}`}
            onClick={() => setInAudio(!inAudio)}
          >
            {inAudio ? "Leave Audio" : "Join Audio"} Room
          </button>
        </div> */}

          {/* {inAudio ? (
          <div className="form-group col-lg-1 col-md-2">
            <br />
            <button
              className={`btn btn-${!isMuted ? "primary" : "secondary"}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? "Muted" : "Speaking"}
            </button>
          </div>
        ) : (
          <div className="form-group col-lg-1 col-md-2" />
        )} */}
        </div>
        <div className="flex justify-center place-items-center">
          <label>Status: {submissionStatus}</label>
        </div>
      </div>

      <hr />
      <div className="flex justify-evenly">
        <div className="">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmitAllTestCases}
            disabled={submissionStatusForTCs.length > 0}
          >
            Submit
          </button>
        </div>
        <div>
          <button
            className={`${
              submissionStatus === runningStatus
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-bold py-2 px-4 rounded`}
            onClick={handleSubmit}
            disabled={submissionStatus === runningStatus}
          >
            {submissionStatus === runningStatus ? "Running" : "Run Code"}
          </button>
        </div>
      </div>
      <div className="w-full flex">
        <Resizable
          onResize={(e) => {
            console.log(e.clientX);
            setWidthLeft(e.clientX + "px");
            setWidthRight(window.outerWidth - 35 - e.clientX + "px");
          }}
          size={{ width: widthLeft, height: "76.5vh" }}
          minHeight={"76.5vh"}
          maxHeight={"76.5vh"}
        >
          <div>
            <h5 className="text-center font-semibold text-xl">Code Here</h5>
            <Editor
              theme={theme}
              width={widthLeft}
              // @ts-ignore
              language={languageToEditorMode[language]}
              body={body}
              setBody={handleUpdateBody}
              fontSize={fontSize}
            />
          </div>
        </Resizable>
        <div className="flex place-items-center">
          {/* <FaGripVertical /> */}
          <span className="font-semibold text-2xl">|</span>
          <span className="font-semibold text">|</span>
          <span className="font-semibold text-2xl">|</span>
        </div>
        <Resizable
          size={{ width: widthRight, height: "76.5vh" }}
          minHeight={"76.5vh"}
          maxHeight={"76.5vh"}
          enable={{ right: false, bottom: false }}
        >
          <h5 className="text-center font-semibold text-xl">Input</h5>
          <Editor
            theme={theme}
            language={""}
            body={input}
            setBody={handleUpdateInput}
            height={"35vh"}
            width={widthRight}
            fontSize={fontSize}
          />
          <h5 className="text-center font-semibold text-xl">Output</h5>
          <Editor
            theme={theme}
            language={""}
            body={output}
            setBody={setOutput}
            readOnly={true}
            height={"35vh"}
            width={widthRight}
            fontSize={fontSize}
          />
        </Resizable>
      </div>
    </div>
  );
};

export default TestPage;
