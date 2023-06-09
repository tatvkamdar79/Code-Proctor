import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/Home";
import JoinRoom from "./pages/joinroom";
import NewRoom from "./pages/newroom";
import NotFound from "./pages/notfound";
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

  return (
    <BrowserRouter>
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
        <Route exact path="/createChallenge" element={<CreateChallange />} />
        <Route
          path="/contest/manage/:contestName/:email"
          element={<IndividualContestProgressReport />}
        />

        <Route
          path="/recruitment-timeline/create"
          element={<RecruitmentTimeline />}
        />
        <Route path="/problems/all" element={<AllQuestions />} />

        <Route
          path="/contests/ongoing"
          element={<OngoingContestsComponent />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
