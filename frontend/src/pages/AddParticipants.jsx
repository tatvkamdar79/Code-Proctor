import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { baseURL } from "../config/config";
import axios from "axios";

const AddParticipants = ({ contest, setContest }) => {
  console.log(contest);
  const [previousGroups, setPreviousGroups] = useState([]);
  const [usersToBeAdded, setUsersToBeAdded] = useState(contest.contestants);
  const [newGroupName, setNewGroupName] = useState("");

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
    if (usersToBeAdded.length == 0) {
      alert("Please fill the form correctly and make sure users are added");
    }
    // TODO: Save users to database for this particular test
    const properUsers = usersToBeAdded.filter((user) => user.length > 0);
    const data = {
      route: "contests/modifyContestants",
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1NDIxMjV9.2TH7h3PNsP-vYO049GsEx4xm2Yj7AmyGVStf7xoxzFE",
      contestId: contest._id["$oid"],
      emails: properUsers,
    };
    try {
      const response = await axios.post(baseURL, data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
    console.log(properUsers);
  };

  const handleAddFromExistingGroup = () => {
    openModal();
  };

  useEffect(() => {
    const data = {
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE3NzI1MjE1ODV9.3-O-JVP8eaYRPtXo0q8pTDc3HY3sN91PXDGPmrbqsDo",
      route: "groups/getGroups",
    };
    axios
      .post(baseURL, data)
      .then((response) => {
        setPreviousGroups(response.data.data.groups);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1 className="text-4xl text-center mt-14">
        Add Particpants to the Contest
      </h1>
      <br /> <br />
      <div className="container border border-gray-400 rounded-lg p-4 mx-auto w-2/3">
        <br />
        <h3 className="text-2xl mb-7 ml-5">Add users</h3>
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
        </div>
        <div className="text-center mt-3" id="userFieldsContainer">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow mr-5"
            style={{ alignItems: "end" }}
            onClick={addUserField}
          >
            + Add Users
          </button>
        </div>
        <br />
      </div>
      <br />
      <div className="text-end" style={{ marginRight: "340px" }}>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow mr-5"
          onClick={handleSaveUsers}
        >
          Save Users
        </button>
        <Link
          to="/createGroup"
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
        <div className="h-96">
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            groups={previousGroups}
            setUsersToBeAdded={setUsersToBeAdded}
          />
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, groups, setUsersToBeAdded }) => {
  const [groupSelected, setGroupSelected] = useState("");

  const handleImport = () => {
    const users = groups[groupSelected].groupMembers;
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
