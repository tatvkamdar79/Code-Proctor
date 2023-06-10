import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/Home";
import JoinRoom from "./pages/joinroom";
import NewRoom from "./pages/newroom";
import NotFound from "./pages/NotFound";
import Room from "./pages/room";
import Test from "./pages/Test";
import PreTest from "./pages/PreTest";
import routes, { roomProps } from "./routes";
import ManageContest from "./pages/ManageContest";
import CreateChallange from "./pages/CreateChallange";
import CreateGroup from "./pages/CreateGroup";
import CreateContest from "./pages/CreateContest";
import ShowStages from "./pages/ShowStages";
import IndividualContestProgressReport from "./components/ContestComponents/IndividualContestProgressReport";
import RecruitmentTimeline from "./pages/RecruitmentTimeline";
import AllQuestions from "./pages/AllQuestions";
import Navbar from "./components/Navbar";
import OngoingContestsComponent from "./components/ContestComponents/OngoingContests";

const App = () => {
  const [previousRooms, setPreviousRooms] = useState([]);
  const [block, setBlock] = useState(false);

  roomProps.updatePreviousRooms = (room) => {
    if (previousRooms[0] === room) return;
    let newRooms = [...previousRooms];
    newRooms.unshift(room);
    newRooms.slice(0, 40);
    setPreviousRooms(newRooms);
  };

  useEffect(() => {
    const prevRoomsString = localStorage.getItem("previousRooms");
    if (prevRoomsString) {
      setPreviousRooms(JSON.parse(prevRoomsString).previousRooms);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("previousRooms", JSON.stringify({ previousRooms }));
  }, [previousRooms]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    if (window.innerWidth < 1300) {
      setBlock(true);
    } else {
      setBlock(false);
    }
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <BrowserRouter>
      {!block && block && (
        <div className="w-full text-center text-2xl h-10 bg-yellow-200 flex justify-center place-items-center border-2 border-gray-400 bg-opacity-70">
          <p className="text-orange-400">Please view the page on a PC</p>
        </div>
      )}
      <div className={`${!block && ""}`}>
        <Navbar />
        <Routes>
          {/* Adding this manually because this structure of routes sucks */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route
            exact
            path="/"
            element={() => <Home previousRooms={previousRooms} />}
          />
          <Route path="/newroom" element={<NewRoom />} />
          <Route path="/joinroom" element={<JoinRoom />} />
          <Route path="/room/:id" element={<Room />} />

          <Route path="/showStages" element={<ShowStages />} />
          <Route path="/preTest/:currentContestName" element={<PreTest />} />
          <Route path="/test/:currentContestName" element={<Test />} />
          <Route path="/createGroup" element={<CreateGroup />} />

          {/* <Route exact path="/createTest" element={<CreateTest />} /> */}

          {/* <Route exact path="/contest/create" element={<CreateContest />} /> */}
          <Route exact path="/contest/create" element={<CreateContest />} />
          <Route
            path="/contest/manage/:currentContestName"
            element={<ManageContest />}
          />
          <Route exact path="/challenge/create" element={<CreateChallange />} />
          <Route
            path="/contest/manage/:contestName/:email"
            element={<IndividualContestProgressReport />}
          />

          <Route path="/challenge/all" element={<AllQuestions />} />

          <Route
            path="/recruitment-timeline/create"
            element={<RecruitmentTimeline />}
          />

          <Route
            path="/contests/ongoing"
            element={<OngoingContestsComponent />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
