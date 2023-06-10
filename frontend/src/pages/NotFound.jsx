import React from "react";
import { Link, useNavigate } from "react-router-dom";

// const NotFound = () => {
//   return (
//     <div className="p-5 text-center">
//       <h1 className="mb-3">404 Page not found</h1>
//       <Link to="/">Return Home</Link>
//     </div>
//   );
// };

// export default NotFound;
//
// "TATV VERSION"

const NotFound = () => {
  const navigate = useNavigate();
  const gifs = [
    "https://i.pinimg.com/originals/f3/1b/5b/f31b5bcda076125bf7010c781a4578a0.gif",
    "https://cdn.dribbble.com/users/1175431/screenshots/6188233/404-error-dribbble-800x600.gif",
  ];
  return (
    <div
      style={{
        backgroundImage: `url("${gifs[0]}")`,
        backgroundColor: "white",
        height: "100%",
        width: "100%",
        position: "absolute",
        top: "0px",
        backgroundRepeat: "no-repeat",
        backgroundSize: "stretch",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="cursor-pointer"
      onClick={() => {
        navigate("/home");
      }}
    ></div>
  );
};

export default NotFound;
