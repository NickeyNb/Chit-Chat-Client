import React, { useState } from "react";
import { sampleUsers } from "../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useTheme } from "../../hooks/useTheme";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const NewGroup = ({ onClose }) => {
  const { themeMode } = useTheme();

  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // redux
  const dispatch = useDispatch();
  const { isNewGroup } = useSelector((state) => state.misc);

  //
  const { isError, error, isLoading, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const errors = [
    {
      isError,
      error,
    },
  ];
  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id],
    );
  };

  const submitHandler = () => {
    if (!groupName) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    // creating the group
    newGroup("Creating New Group...", {
      name: groupName,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center ${themeMode === "dark" ? "bg-gray-900 bg-opacity-50" : ""}`}
    >
      <div
        className={`w-96 rounded-lg ${themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white"} p-8`}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose} // Call onClose function when the button is clicked
            className={`text-gray-500 hover:text-orange-400 ${themeMode === "dark" ? "text-white" : "text-black"} focus:outline-none`}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        <h2
          className={`mb-4 text-center text-xl font-semibold ${themeMode === "dark" ? "text-white" : "text-black"}`}
        >
          New Group
        </h2>
        <input
          type="text"
          placeholder="Group Name"
          className={`mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none ${themeMode === "dark" ? "bg-gray-700 text-white" : ""}`}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <p
          className={`mb-2 ${themeMode === "dark" ? "text-white" : "text-black"}`}
        >
          Members
        </p>
        <ul>
          {isLoading ? (
            <div>Load</div>
          ) : (
            data?.friends?.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
                themeMode={themeMode} // Pass theme mode to child component
              />
            ))
          )}
        </ul>
        <div className="mt-4 flex justify-between">
          <button
            onClick={closeHandler}
            className={`mr-2 rounded border ${themeMode === "dark" ? "border-gray-500 text-white hover:bg-gray-700 hover:font-semibold hover:text-white" : "border-red-500 text-red-500 hover:bg-red-500  hover:font-semibold hover:text-white"} px-4 py-2 font-light hover:text-white`}
          >
            Cancel
          </button>
          <button
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
            className={`rounded ${themeMode === "dark" ? "bg-green-500" : "bg-green-500"} px-4 py-2 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroup;
