import React, { useEffect, useState } from "react";
import { languageToEditorMode } from "../config/mappings";
import API from "../utils/API";
import SplitPane from "react-split-pane";

import socket from "../utils/socket";
import { baseURL } from "../config/config";
import Peer from "peerjs";
import { diff_match_patch } from "diff-match-patch";
import { useNavigate, useParams } from "react-router-dom";
import CodePairEditor from "../components/CodePairEditor";
import axios from "axios";

import { AiOutlineCaretDown } from "react-icons/ai";

// interface RoomProps {
//     updatePreviousRooms: (room: string) => any;
// }

var myPeer;
var audios = {};
var peers = {};
var myAudio;

// Audio rooms work fine for the most part, except for the asynchrousity caused by hooks that sometimes leads
// to trying to destroy an already destoyed thing, or when we were in process of it.
// So yeah, something to work on #TODO

const Room = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [body, setBody] = useState("");
  const [widthLeft, setWidthLeft] = useState("");
  const [widthRight, setWidthRight] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const [showNoteContent, setShowNoteContent] = useState(false);
  const [notes, setNotes] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  const [submissionCheckerId, setSubmissionCheckerId] = useState();

  const [inAudio, setInAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const dmp = new diff_match_patch();

  useEffect(() => {
    socket.off("userjoined");
    socket.on("userjoined", () => {
      socket.emit("setBody", { value: body, roomId: id });
      socket.emit("setLanguage", { value: language, roomId: id });
      socket.emit("setInput", { value: input, roomId: id });
      socket.emit("setOutput", { value: output, roomId: id });
    });
  }, [body, language, input, output]);

  useEffect(() => {
    socket.off("updateBody");
    socket.on("updateBody", (patch) => {
      const [newBody, res] = dmp.patch_apply(patch, body);
      if (res[0]) setBody(newBody);
      else console.log("Failed", body, patch);
    });
  }, [body]);

  useEffect(() => {
    socket.off("updateInput");
    socket.on("updateInput", (patch) => {
      const [newInput, res] = dmp.patch_apply(patch, input);
      if (res[0]) setInput(newInput);
      else console.log("Failed", body, patch);
    });
  }, [input]);

  useEffect(() => {
    // const id = roomId;
    // props.match.params.id;
    socket.emit("joinroom", id);
    const data = {
      route: "room/getRoom",
      id: id,
    };
    console.log(data);
    axios
      .post(baseURL, data)
      .then((response) => {
        console.log(response.data);
        setBody(response.data.data.body);
        setInput(response.data.data.input);
        setLanguage(response.data.data.language);
      })
      .catch((err) => {
        console.log("Error", err);
      });
    return () => {
      if (myPeer) {
        socket.emit("leaveAudioRoom", myPeer.id);
        destroyConnection();
      }
      myAudio = null;
      socket.emit("leaveroom", id);
    };
  }, []);
  // [props.match.params.id]);

  useEffect(() => {
    socket.on("setBody", (body) => {
      setBody(body);
    });
    socket.on("setInput", (input) => {
      setInput(input);
    });
    socket.on("setLanguage", (language) => {
      setLanguage(language);
    });
    socket.on("setOutput", (output) => {
      setOutput(output);
    });

    const resizeCallback = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", resizeCallback);

    return () => {
      window.removeEventListener("resize", resizeCallback);
    };
  }, []);

  useEffect(() => {
    setInAudio(false);
  }, [id]);

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
          socket.emit("setOutput", { value: output, roomId: id });
        }
      );
    }
  }, [submissionStatus]);

  const handleSubmit = () => {
    if (submissionStatus === runningStatus) return;
    setSubmissionStatus(runningStatus);
    const data = {
      route: "room/saveChanges",
      id,
      title,
      body,
      input,
      language,
    };
    axios
      .post(baseURL, data)
      .then((response) => {
        console.log(response.data.data);
      })
      .catch((err) => {
        setSubmissionStatus(errorStatus);
        return;
      });

    const params = {
      source_code: body,
      language: language,
      input: input,
      api_key: "guest",
    };
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

  const handleUpdateBody = (value) => {
    const patch = dmp.patch_make(body, value);
    setBody(value);
    socket.emit("updateBody", { value: patch, roomId: id });
    // debounce(
    //   () => socket.emit("updateBody", { value: patch, roomId: id }),
    //   100
    // )();
  };

  const handleUpdateInput = (value) => {
    const patch = dmp.patch_make(input, value);
    setInput(value);
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

  // Voice room stuff
  const getAudioStream = () => {
    const myNavigator =
      navigator.mediaDevices.getUserMedia ||
      // @ts-ignore
      navigator.mediaDevices.webkitGetUserMedia ||
      // @ts-ignore
      navigator.mediaDevices.mozGetUserMedia ||
      // @ts-ignore
      navigator.mediaDevices.msGetUserMedia;
    return myNavigator({ audio: true });
  };

  const createAudio = (data) => {
    const { id, stream } = data;
    if (!audios[id]) {
      const audio = document.createElement("audio");
      audio.id = id;
      audio.srcObject = stream;
      if (myPeer && id == myPeer.id) {
        myAudio = stream;
        audio.muted = true;
      }
      audio.autoplay = true;
      audios[id] = data;
      console.log("Adding audio: ", id);
    } // } else {
    //     console.log('adding audio: ', id);
    //     // @ts-ignore
    //     document.getElementById(id).srcObject = stream;
    // }
  };

  const removeAudio = (id) => {
    delete audios[id];
    const audio = document.getElementById(id);
    if (audio) audio.remove();
  };

  const destroyConnection = () => {
    console.log("distroying", audios, myPeer.id);
    if (audios[myPeer.id]) {
      const myMediaTracks = audios[myPeer.id].stream.getTracks();
      myMediaTracks.forEach((track) => {
        track.stop();
      });
    }
    // if (myPeer) myPeer.destroy();
  };

  const setPeersListeners = (stream) => {
    myPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userAudioStream) => {
        createAudio({ id: call.metadata.id, stream: userAudioStream });
      });
      call.on("close", () => {
        removeAudio(call.metadata.id);
      });
      call.on("error", () => {
        console.log("peer error");
        if (!myPeer.destroyed) removeAudio(call.metadata.id);
      });
      peers[call.metadata.id] = call;
    });
  };

  const newUserConnection = (stream) => {
    socket.on("userJoinedAudio", (userId) => {
      const call = myPeer.call(userId, stream, { metadata: { id: myPeer.id } });
      call.on("stream", (userAudioStream) => {
        createAudio({ id: userId, stream: userAudioStream });
      });
      call.on("close", () => {
        removeAudio(userId);
      });
      call.on("error", () => {
        console.log("peer error");
        if (!myPeer.destroyed) removeAudio(userId);
      });
      peers[userId] = call;
    });
  };

  useEffect(() => {
    if (inAudio) {
      myPeer = new Peer();
      myPeer.on("open", (userId) => {
        console.log("opened");
        getAudioStream().then((stream) => {
          socket.emit("joinAudioRoom", id, userId);
          stream.getAudioTracks()[0].enabled = !isMuted;
          newUserConnection(stream);
          setPeersListeners(stream);
          createAudio({ id: myPeer.id, stream });
        });
      });
      myPeer.on("error", (err) => {
        console.log("peerjs error: ", err);
        if (!myPeer.destroyed) myPeer.reconnect();
      });
      socket.on("userLeftAudio", (userId) => {
        console.log("user left aiudio:", userId);
        if (peers[userId]) peers[userId].close();
        removeAudio(userId);
      });
    } else {
      console.log("leaving", myPeer);
      if (myPeer) {
        socket.emit("leaveAudioRoom", myPeer.id);
        destroyConnection();
      }
      myAudio = null;
    }
  }, [inAudio]);

  useEffect(() => {
    if (inAudio) {
      if (myAudio) {
        myAudio.getAudioTracks()[0].enabled = !isMuted;
      }
    }
  }, [isMuted]);
  return (
    <div className="">
      {/* <Modal /> */}
      <div className="flex justify-center gap-x-14">
        <div className="flex flex-col items-center justify-center">
          <label className="text-center">Choose Language</label>
          {/* <br /> */}
          <select
            className=""
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              socket.emit("setLanguage", {
                value: event.target.value,
                roomId: id,
              });
            }}
          >
            {languages.map((lang, index) => (
              <option key={index} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-center justify-center col-span-2 md:col-span-3">
          <label className="text-center">Choose Theme</label>
          <select
            className="form-select"
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
          >
            {themes.map((theme, index) => (
              <option key={index} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-center justify-center col-span-2 md:col-span-3">
          <label className="text-center">Font Size</label>
          <select
            className="form-select"
            value={fontSize}
            onChange={(event) => setFontSize(event.target.value)}
          >
            {fontSizes.map((fontSize, index) => (
              <option key={index} value={fontSize}>
                {fontSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center col-span-2 md:col-span-2">
          <div className="text-center mt-3" id="userFieldsContainer">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md shadow mr-5"
              style={{ alignItems: "end" }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
            >
              Copy room link
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center col-span-2 md:col-span-2">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md shadow mr-5"
            style={{ alignItems: "end" }}
            onClick={() => setInAudio(!inAudio)}
          >
            {inAudio ? "Leave Audio" : "Join Audio"} Room
          </button>
        </div>
        {inAudio ? (
          <div className="flex flex-col items-center justify-center col-span-2 md:col-span-2">
            <button
              className={`${
                !isMuted ? "bg-blue-600" : "bg-red-600"
              } text-white font-semibold py-2 px-4 rounded-md shadow mr-5`}
              style={{ alignItems: "end" }}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? "Muted" : "Speaking"}
            </button>
          </div>
        ) : (
          <div className="form-group col-span-2 md:col-span-2" />
        )}
        <div className="flex flex-col items-center justify-center col-span-2 md:col-span-2">
          <label className="text-center">Status: {submissionStatus}</label>
        </div>
        <div className="w-80 bg-gray-400 flex place-items-center justify-center relative rounded-lg">
          <div
            className="w-11/12 mx-auto flex justify-between font-semibold font-mono text-xl px-5 cursor-pointer"
            onClick={() => {
              setOpenNotes((openNotes) => !openNotes);
              if (openNotes) {
                setShowNoteContent(false);
              } else {
                setTimeout(() => {
                  setShowNoteContent(true);
                }, 200);
              }
            }}
          >
            <p>My Notes</p>
            <AiOutlineCaretDown
              size={25}
              className={`${
                openNotes && "rotate-180"
              } transition-all duration-500`}
            />
          </div>
          <div
            className={`absolute w-full mx-auto top-0 mt-10 border bg-gray-100 rounded-b-lg z-50 ${
              openNotes ? "h-64 min-h-[200px]" : "h-0 min-h-0"
            } transition-all duration-500`}
          >
            {showNoteContent && (
              <div className="flex flex-col h-full place-items-center justify-center">
                <textarea
                  name=""
                  id=""
                  autoFocus
                  className="w-full h-[85%] resize-none p-3 font-semibold bg-gray-200 outline-gray-400"
                  style={{ fontVariant: "5px" }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button
                  className="w-[91%] h-[15%] bg-green-500 font-semibold font-mono text-xl text-center place-self-center justify-self-center pt-0.5 scale-[101%] rounded-lg mt-0.5 hover:scale-110 transition-all duration-300"
                  onClick={() => {
                    console.log("Write controller to save notes");
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr />

      <div className="flex items-center justify-center col my-5">
        <button
          className={`bg-green-700  text-white font-semibold py-2 px-2 rounded-md shadow mr-5`}
          style={{ alignItems: "end" }}
          onClick={() => {
            openModal();
          }}
        >
          Invite people to the room?
        </button>
      </div>

      <SplitPane
        split="vertical"
        minSize={150}
        maxSize={windowWidth - 150}
        defaultSize={windowWidth / 2}
        className="flex-row text-center"
        style={{ height: "78vh", width: "100vw", marginRight: "0" }}
        onChange={handleWidthChange}
      >
        <div>
          <div className="flex pl-24 gap-x-24">
            <h5 className="col py-2">Code Here</h5>
            <div className="flex items-center justify-center col">
              <button
                className={`bg-gray-500  text-white font-semibold py-2 px-2 rounded-md shadow mr-5`}
                style={{ alignItems: "end" }}
                onClick={() => {
                  navigator.clipboard.writeText(body);
                }}
              >
                Copy Code
              </button>
            </div>
            <div className="flex items-center justify-center col">
              <button
                className={`bg-blue-600  text-white font-semibold py-2 px-2 rounded-md shadow mr-5`}
                style={{ alignItems: "end" }}
                onClick={handleSubmit}
                disabled={submissionStatus === runningStatus}
              >
                Save and Run
              </button>
            </div>
          </div>
          <CodePairEditor
            theme={theme}
            width={widthLeft}
            language={languageToEditorMode[language]}
            body={body}
            setBody={handleUpdateBody}
            fontSize={fontSize}
          />
        </div>
        <div className="text-center">
          <h5>Input</h5>
          <CodePairEditor
            theme={theme}
            language={""}
            body={input}
            setBody={handleUpdateInput}
            height={"35vh"}
            width={widthRight}
            fontSize={fontSize}
          />
          <h5>Output</h5>
          <CodePairEditor
            theme={theme}
            language={""}
            body={output}
            setBody={setOutput}
            readOnly={true}
            height={"39vh"}
            width={widthRight}
            fontSize={fontSize}
          />
        </div>
      </SplitPane>
      <div className="h-96">
        <Modal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose }) => {
  const [emailList, setEmailList] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const addEmail = () => {
    if (emailInput.trim() !== "") {
      if (!validateEmail(emailInput)) {
        setMessage("Please enter a valid email");
        setIsError(true);
      } else {
        setEmailList([...emailList, emailInput]);
        setEmailInput("");
        setMessage("");
        setIsError(false);
      }
    }
  };

  const deleteEmail = (index) => {
    setEmailList(emailList.filter((_, i) => i !== index));
  };

  const handleSendInvites = async () => {
    const url = window.location.href;
    const data = {
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI3ODgwNzd9.Pdw-8UvyEXYtA0JKGK3S6JD29dkQzaRwkE8Grg-AJdQ",
      route: "room/sendInvites",
      url,
      emails: emailList,
    };

    try {
      setMessage("Sent invites successfully!");
      setIsError(false);
      const response = await axios.post(baseURL, data);
      console.log(response.data);
    } catch (err) {
      setMessage("Some error occurred while sending, please try again");
      setIsError(true);
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 h-full">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded">
            {/* Modal content */}
            <h2 className="text-xl font-bold mb-4">Invite People</h2>
            <p
              className={`text-sm ${
                !isError ? "text-green-700" : "text-red-700"
              } items-center mb-3`}
            >
              {message}
            </p>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 mb-4"
              placeholder="Enter email address"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-3 py-2 px-4 rounded"
              onClick={addEmail}
            >
              Add Email
            </button>

            <ul className="mt-4">
              {emailList.map((email, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border border-gray-300 rounded px-4 py-2 mb-2"
                >
                  <span>{email}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteEmail(index)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-col">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleSendInvites}
              >
                Send invites
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
