import React, { useState } from "react";
import { sampleUsers } from "../constants/sampleData";
import UserItem from "../shared/UserItem";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";

const AddMemberDialog = ({ chatId }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  // redux
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);
  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation,
  );
  console.log(selectedMembers);
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id],
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding members...", { members: selectedMembers, chatId });
    closeHandler();
  };

  useErrors([{ isError, error }]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-80 rounded-lg bg-white p-8">
        <h2 className="mb-4 text-center text-2xl font-bold">Add Member</h2>
        <div className="space-y-4">
          {isLoading ? (
            <div>Load</div>
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          ) : (
            <p className="text-center">No Friends</p>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400"
            onClick={closeHandler}
          >
            Cancel
          </button>
          <button
            disabled={isLoadingAddMembers}
            className={`rounded-md bg-green-500 px-4 py-2 text-white ${
              isLoadingAddMembers && "cursor-not-allowed opacity-50"
            }`}
            onClick={addMemberSubmitHandler}
          >
            Submit changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberDialog;
