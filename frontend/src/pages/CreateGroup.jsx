import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { baseURL } from "../config/config";

const CreateGroup = () => {
  const [previousGroups, setPreviousGroups] = useState([]);
  const [usersToBeAdded, setUsersToBeAdded] = useState([""]);
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

  const handleCreateGroup = async () => {
    if (newGroupName == "" || usersToBeAdded.length == 0) {
      alert("Please fill the form correctly and make sure users are added");
    }
    let data = {
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE2ODYxMjAwMTF9.wlgTFIaMwaIAapj1B-5TQp9mR0cZh4mlPW1wdE6uaas",
      route: "groups/checkIfNameIsAvailable",
      groupName: newGroupName,
    };
    try {
      let response = await axios.post(baseURL, data);
      console.log(response);
      if (response.status == 400) {
        alert("Please enter a unique group name");
        return;
      }
      const properUsers = usersToBeAdded.filter((user) => user.length > 0);
      data["route"] = "groups/createGroup";
      data["groupMembers"] = properUsers;
      response = await axios.post(baseURL, data);
      // TODO: Handle redirection
      alert("Group created successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddFromExistingGroup = () => {
    openModal();
  };

  useEffect(() => {
    const data = {
      authToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiYW1hbiIsImVtYWlsIjoiYW1hbkBnbWFpbC5jb20iLCJleHAiOjE2ODYxMjAwMTF9.wlgTFIaMwaIAapj1B-5TQp9mR0cZh4mlPW1wdE6uaas",
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
      <h1 className="text-4xl text-center mt-14">Create Group</h1>
      <br /> <br />
      <div className="container border border-gray-400 rounded-lg p-4 mx-auto w-2/3">
        <br />
        <div className="flex place-items-center py-2 gap-x-5 mb-5">
          <h3 className="text-3xl ml-5">Group Name</h3>
          <input
            className="w-2/3 border-2 border-[#d4d9dd] outline-none pl-3 py-1"
            type="text"
            placeholder="Enter Group Name"
            value={newGroupName}
            onChange={(e) => {
              setNewGroupName(e.target.value);
            }}
          />
        </div>

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
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow mr-5"
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
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow mr-5"
          onClick={handleCreateGroup}
        >
          Create Group
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow mr-5"
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

export default CreateGroup;
