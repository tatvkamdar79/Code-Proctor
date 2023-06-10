import Room from "./pages/room";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import JoinRoom from "./pages/joinroom";
import NewRoom from "./pages/newroom";

let updatePreviousRooms = () => {
  console.log("default");
};

let roomProps = {
  updatePreviousRooms,
};

const routes = [
  {
    path: "/room/:id",
    exact: true,
    component: Room,
    props: {
      props: roomProps,
    },
  },
  {
    path: "/404",
    exact: true,
    component: NotFound,
  },
  {
    path: "/joinroom",
    exact: true,
    component: JoinRoom,
  },
  {
    path: "/newroom",
    exact: true,
    component: NewRoom,
  },

  // Should stay at end
  {
    path: "/",
    exact: false,
    component: NotFound,
  },
];
export { roomProps };
export default routes;
