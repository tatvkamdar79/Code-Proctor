import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../config/config";
import axios from "axios";
import AddingUsersToGroupLoadingGif from "../assets/addingUsersLoading.gif";
import { getCookie } from "../Hooks/useCookies";

const AddParticipants = ({ contest, setContest }) => {
  const navigate = useNavigate();
  const [previousGroups, setPreviousGroups] = useState([]);
  const [usersToBeAdded, setUsersToBeAdded] = useState(contest.contestants);
  const [newGroupName, setNewGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailList, setEmailList] = useState(contest.contestants);
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

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addUserField = () => {
    const newUsersState = [...usersToBeAdded, ""];
    setUsersToBeAdded(newUsersState);
  };

  const removeUser = (idx) => {
    const newUsersState = [...usersToBeAdded];
    newUsersState.splice(idx, 1);
    setUsersToBeAdded(newUsersState);
  };

  const handleSaveUsers = async () => {
    if (emailList.length == 0) {
      alert("Please fill the form correctly and make sure users are added");
      return;
    }
    const properUsers = emailList.filter(
      (user) =>
        user.length > 0 &&
        user.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
    );

    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    const data = {
      route: "contests/modifyContestants",
      authToken: jwt,
      contestId: contest._id["$oid"],
      emails: properUsers,
    };
    try {
      setLoading(true);
      const response = await axios.post(baseURL, data);
      setLoading(false);
      setUsersToBeAdded(properUsers);
      console.log(response.data);
      if (response.data.status === 200) {
        const data = {
          authToken: jwt,
          route: "contests/getContestDetails",
          contestName: contest.contestName,
        };
        axios
          .post(baseURL, data)
          .then((response) => {
            console.log("Contest changed", response.data.data.contest);
            setContest(response.data.data.contest);
            setIsError(false);
            setMessage("Participants modified successfully");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    console.log(properUsers);
  };

  const handleAddFromExistingGroup = () => {
    openModal();
  };

  useEffect(() => {
    let jwt = getCookie("JWT_AUTH");
    if (jwt.length === 0) {
      navigate("/login");
      return;
    }

    const data = {
      authToken: jwt,
      route: "groups/getGroups",
    };
    axios
      .post(baseURL, data)
      .then((response) => {
        console.log(response.data.data.groups);
        setPreviousGroups(response.data.data.groups);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <div className={`${loading && "blur-[3px]"}`}>
        <h1 className="text-4xl font-bold font-mono text-center mt-14">
          Add Particpants to the Contest
        </h1>
        <br /> <br />
        <div className="container border border-gray-400 rounded-lg p-4 mx-auto w-4/5">
          <br />
          {/* <h3 className="text-2xl mb-7 ml-5">Add users</h3>
          <div className="flex flex-col gap-y-5 mb-5">
            {usersToBeAdded.map((user, idx) => {
              return (
                <div className="flex" key={idx}>
                  <label className="w-48 pl-5 text-lg">Enter User email:</label>
                  <input
                    className="w-2/3 border-2 border-[#d4d9dd] outline-none pl-3"
                    type="text"
                    placeholder="Enter email"
                    id={idx}
                    value={user}
                    onChange={(e) => {
                      const newState = [...usersToBeAdded];
                      newState[e.target.id] = e.target.value;
                      setUsersToBeAdded(newState);
                    }}
                  />

                  <AiFillDelete
                    className="ml-2 cursor-pointer text-red-500"
                    size={25}
                    onClick={() => removeUser(idx)}
                  />
                </div>
              );
            })}
          </div> */}
          <div className="bg-white p-6 rounded">
            {/* Modal content */}
            <div className="flex gap-x-28">
              <h2 className="text-xl font-bold mb-4">
                Invite People to Participate
              </h2>

              <h4 className="text-lg font-bold mb-4 place-items-end">
                Number of Paritcipants: {emailList.length}
              </h4>
            </div>
            <p
              className={`text-sm ${
                !isError ? "text-green-700" : "text-red-700"
              } items-center mb-3`}
            >
              {message}
            </p>
            <div className="flex justify-between w-full place-items-center">
              <div className="flex justify-center place-items-center">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2"
                  placeholder="Enter email address"
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-3 py-2 px-4 rounded mr-5"
                  onClick={addEmail}
                >
                  Add Email
                </button>
              </div>
              <div className="text-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow mr-5"
                  onClick={handleSaveUsers}
                >
                  Save Users
                </button>
                <Link
                  to="/create-group"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-[11px] px-4 rounded-md shadow mr-5"
                >
                  Create Group
                </Link>
                <button
                  type="submit"
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md shadow mr-5"
                  onClick={handleAddFromExistingGroup}
                >
                  Add from existing Group
                </button>
                {/* <div className="h-96">
                <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                groups={previousGroups}
                setUsersToBeAdded={setEmailList}
                />
              </div> */}
              </div>
            </div>
            <br />
            <hr />

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
          </div>
          {/* <div className="text-center mt-3" id="userFieldsContainer">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow mr-5"
              style={{ alignItems: "end" }}
              onClick={addUserField}
            >
              + Add Users
            </button>
          </div> */}
          <br />
        </div>
        <br />
        <div className="text-end" style={{ marginRight: "340px" }}>
          <div className="h-96">
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              groups={previousGroups}
              setUsersToBeAdded={setEmailList}
            />
          </div>
        </div>
      </div>
      {loading && (
        <div className="absolute h-screen w-full top-0 left-0 flex justify-center place-items-center">
          <div>
            <p className="w-full text-center text-3xl font-semibold font-mono animate-bounce text-gray-800">
              <span className="animate-pulse">Saving users...</span>
            </p>
            <img src={AddingUsersToGroupLoadingGif} alt="" className="" />
          </div>
        </div>
      )}
    </div>
  );
};

const Modal = ({ isOpen, onClose, groups, setUsersToBeAdded }) => {
  const [groupSelected, setGroupSelected] = useState(0);

  const handleImport = () => {
    const users = groups[groupSelected]?.groupMembers;
    setUsersToBeAdded(users);
    console.log("Import", users);
    onClose();
  };

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 h-full">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="absolute bg-white rounded-lg p-6 h-96 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Add users from a previous group
          </h2>
          <div className="mb-4 mt-8">
            <label htmlFor="options" className="block font-medium mb-2">
              Select a group:
            </label>
            <select
              id="options"
              className="w-full px-3 py-2 border border-gray-300 rounded-md max-h-10 overflow-y-scroll"
              onChange={(e) => setGroupSelected(e.target.value)}
            >
              {groups.map((group, idx) => {
                return <option value={idx}>{group.groupName}</option>;
              })}
            </select>
          </div>
        </div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mr-2 mt-12"
          onClick={handleImport}
        >
          Import
        </button>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mr-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddParticipants;
