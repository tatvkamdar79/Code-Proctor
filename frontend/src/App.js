import React from "react";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JoinRoom from "./pages/JoinRoom";
import NewRoom from "./pages/NewRoom";
import NotFound from "./pages/NotFound";
import Room from "./pages/Room";
import Test from "./pages/Test";
import PreTest from "./pages/PreTest";
import { roomProps } from "./routes";
import ManageContest from "./pages/ManageContest";
import CreateChallange from "./pages/CreateChallange";
import CreateGroup from "./pages/CreateGroup";
import CreateContest from "./pages/CreateContest";
import AllQuestions from "./pages/AllQuestions";
import Navbar from "./components/Navbar";
import OngoingContestsComponent from "./components/ContestComponents/OngoingContests";
import CodePairHome from "./pages/CodePairHome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { baseURL } from "./config/config";
import { getCookie } from "./Hooks/useCookies";
import axios from "axios";
import ThankYou from "./pages/ThankYou";
import AllContestsComponent from "./components/ContestComponents/AllContests";

const userContext = createContext("User Context");

const App = () => {
  const [user, setUser] = useState({ loggedIn: false });
  const [previousRooms, setPreviousRooms] = useState([]);
  const [block, setBlock] = useState(false);
  const [page, setPage] = useState(null);

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
  console.log();

  useEffect(() => {
    setPage(window.location.pathname);
  }, [window.location.pathname]);

  async function getUserDetails() {
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      return;
    }

    const data = {
      route: "users/getUserDetails",
      authToken: jwt,
    };

    const response = await axios.post(baseURL, data);
    let fetchedUser = response.data.data.data;
    fetchedUser.loggedIn = true;
    setUser(fetchedUser);
    return fetchedUser;
  }

  useEffect(() => {
    // Function to get user Details from backend from JWT

    // Getting user if not logged in.
    if (getCookie("JWT_AUTH").length > 0 && user.loggedIn === false) {
      console.log("Fetching user details now");
      getUserDetails().then((fetchedUser) => {
        console.log("From App.js -> Got user from backend", fetchedUser);
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>{/* CODE PAIR */}</Routes>
      <userContext.Provider value={{ user, setUser, getUserDetails }}>
        {block && !block && (
          <div className="w-full text-center text-2xl h-10 bg-yellow-200 flex justify-center place-items-center border-2 border-gray-400 bg-opacity-70">
            <p className="text-orange-400">Please view the page on a PC</p>
          </div>
        )}
        <div className={`${block && ""}`}>
          {page &&
            !page.includes("/pretest/") &&
            !page.includes("/test/") &&
            !page.includes("/thank-you-for-taking-the-test") && <Navbar />}
          <Routes>
            <Route
              exact
              path="/codepair"
              element={<CodePairHome previousRooms={previousRooms} />}
            />
            <Route path="/newroom" element={<NewRoom />} />
            <Route path="/joinroom" element={<JoinRoom />} />
            <Route path="/room/:id" element={<Room />} />
            {/* NETRY AND HOME ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* LOGIN and REGISTER */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* CONTEST, CHALLENGE AND GROUP ROUTES */}
            <Route exact path="/contest/create" element={<CreateContest />} />
            <Route
              exact
              path="/challenge/create"
              element={<CreateChallange />}
            />
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/contest/all" element={<AllContestsComponent />} />
            <Route
              path="/contests/ongoing"
              element={<OngoingContestsComponent />}
            />
            <Route path="/challenge/all" element={<AllQuestions />} />

            {/* TEST ROUTES */}
            <Route
              path="/preTest/:currentContestName/:userHash"
              element={<PreTest />}
            />
            <Route
              path="/test/:currentContestName/:userHash"
              element={<Test />}
            />
            <Route
              path="/contest/manage/:currentContestName"
              element={<ManageContest />}
            />

            <Route
              path="/thank-you-for-taking-the-test"
              element={<ThankYou />}
            />

            {/* <Route
            path="/contest/manage/:contestName/:email"
            element={<IndividualContestProgressReport />}
          /> */}

            {/* TRYING */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </userContext.Provider>
    </BrowserRouter>
  );
};

export default App;
export { userContext };
