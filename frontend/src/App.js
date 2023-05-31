import React, { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/home";
import JoinRoom from "./pages/joinroom";
import NewRoom from "./pages/newroom";
import NotFound from "./pages/notfound";
import Room from "./pages/room";
import Test from "./pages/Test";
import CreateTest from "./pages/CreateTest";
import TestPage from "./pages/TestPage";
import PreTest from "./pages/PreTest";
import routes, { roomProps } from "./routes";
import CreateContest from "./pages/CreateContest";
import CreateChallange from "./pages/CreateChallange";
import CreateGroup from "./pages/CreateGroup";

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
      {/* <Header /> */}
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

        <Route path="/preTest" element={<PreTest />} />
        <Route path="/test/:testName" element={<Test />} />
        <Route path="/createGroup" element={<CreateGroup />} />

        <Route exact path="/createTest" element={<CreateTest />} />
        <Route exact path="/createContest" element={<CreateContest />} />
        <Route exact path="/createChallange" element={<CreateChallange />} />
        <Route path="/codingTest" element={<TestPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
