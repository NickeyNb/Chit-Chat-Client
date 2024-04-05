import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChats, sampleUsers } from "../components/constants/sampleData";
import UserItem from "../components/shared/UserItem";
import { FaChevronLeft, FaEdit } from "react-icons/fa";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { useTheme } from "../hooks/useTheme";
import Header from "../components/layout/Header";
import {
  useAddGroupMembersMutation,
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { setIsAddMember } from "../redux/reducers/misc";
import { LayoutLoader } from "../components/layout/Loaders";
import { useDispatch, useSelector } from "react-redux";

const ConfirmDeleteDialog = lazy(
  () => import("../components/dialogs/ConfirmDeleteDialog"),
);
const AddMemberDialog = lazy(
  () => import("../components/dialogs/AddMemberDialog"),
);

const Groups = () => {
  const { themeMode } = useTheme(); // Get the current theme mode

  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  // redux
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");
  // console.log(myGroups.data);  // groups
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId },
  );
  // console.log(groupDetails.data);
  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation,
  );
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation,
  );
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation,
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [members, setMembers] = useState([]);
  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];
  useErrors(errors);
  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
    console.log("Delete");
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    // console.log("Remove member", id);
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue("Group Name");
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <div className="fixed left-4 top-16 sm:hidden">
        <button
          className="rounded-full  p-2 text-xl text-black"
          onClick={handleMobile}
        >
          ☰
        </button>
      </div>
      <div className="absolute right-8 top-20">
        <button
          className={`${themeMode === "dark" ? "text-white" : ""} rounded-lg  px-4 py-2 text-black`}
          onClick={navigateBack}
        >
          <FaChevronLeft />
        </button>
      </div>
    </>
  );

  const GroupName = (
    <div className={`flex items-center  px-12 py-8 `}>
      {isEdit ? (
        <>
          <input
            type="text"
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            className={`${themeMode === "dark" ? "text-black" : ""} rounded-lg border-b border-gray-400 px-4 py-4 focus:outline-none`}
          />
          <button
            disabled={isLoadingGroupName}
            className={`${themeMode === "dark" ? "text-white" : ""} ml-4 rounded-md px-4  py-2 text-black disabled:cursor-not-allowed`}
            onClick={updateGroupName}
          >
            <IoCheckmarkDoneCircleOutline size={30} />
          </button>
        </>
      ) : (
        <>
          <h2
            className={`text-xl font-bold text-black ${themeMode === "dark" ? "text-black" : ""}`}
          >
            {groupName}
          </h2>
          <button
            disabled={isLoadingGroupName}
            className={`rounded-md px-4  py-2 text-black disabled:cursor-not-allowed ${themeMode === "dark" ? "text-white" : ""}`}
            onClick={() => setIsEdit(true)}
          >
            <FaEdit size={25} />
          </button>
        </>
      )}
    </div>
  );

  const ButtonGroup = (
    <div className="mt-8 flex flex-col items-center space-y-4 sm:justify-between">
      <button
        className={`mb-4 rounded-md border ${themeMode === "dark" ? "border-gray-500 text-white hover:bg-gray-700 hover:font-semibold hover:text-white" : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"} px-4 py-2 font-light`}
        onClick={openConfirmDeleteHandler}
      >
        Delete Group
      </button>
      <button
        className={`rounded-md ${themeMode === "dark" ? "bg-green-500 text-white" : "bg-green-500"} px-4 py-2`}
        onClick={openAddMemberHandler}
      >
        Add Member
      </button>
    </div>
  );

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <>
      <Header />
      <div
        className={`grid h-screen grid-cols-1 sm:grid-cols-12 ${themeMode === "dark" ? "bg-gray-800 text-white" : ""}`}
      >
        <div
          className={`hidden overflow-auto bg-white/50 p-4 text-white sm:col-span-4 sm:block ${themeMode === "dark" ? "bg-gray-800 text-white" : ""}`}
        >
          <h1 className="mb-4 text-xl font-bold text-black">My Groups</h1>
          <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
        </div>
        <div
          className={`bg-gray-100 p-4 sm:col-span-8 ${themeMode === "dark" ? "bg-gray-600 text-white" : ""}`}
        >
          {IconBtns}
          {groupName ? (
            <>
              {GroupName}
              <p className="mt-8 text-center text-xl font-semibold">Members</p>
              <div className="mx-auto mt-4 max-w-xl overflow-auto">
                {isLoadingRemoveMember ? (
                  <div>Load..</div>
                ) : (
                  members.map((user) => (
                    <UserItem
                      key={user._id}
                      user={user}
                      isAdded
                      handler={removeMemberHandler}
                      themeMode={themeMode} // Pass theme mode to child component
                    />
                  ))
                )}
              </div>
              {ButtonGroup}
            </>
          ) : (
            <div>Click on group to edit </div>
          )}
        </div>
        {isMobileMenuOpen && (
          <div className="fixed left-0 top-0 z-50 h-screen w-3/5 bg-gray-200 p-4 text-white">
            <div className="absolute right-2 top-4">
              <button
                className="text-xl text-black"
                onClick={handleMobileClose}
              >
                ✕
              </button>
            </div>
            <GroupsList
              myGroups={myGroups?.data?.groups}
              chatId={chatId}
              w={"50vw"}
            />
          </div>
        )}
        <Suspense fallback={<div>Loading...</div>}>
          {isAddMember && <AddMemberDialog chatId={chatId} />}
          {confirmDeleteDialog && (
            <ConfirmDeleteDialog
              open={confirmDeleteDialog}
              handleClose={closeConfirmDeleteHandler}
              deleteHandler={deleteHandler}
            />
          )}
        </Suspense>
      </div>
    </>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <div style={{ width: w }}>
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem key={group._id} group={group} chatId={chatId} />
      ))
    ) : (
      <p className="text-center">No groups</p>
    )}
  </div>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
      className="mb-1 block rounded-lg bg-white p-4 shadow-md transition duration-300 ease-in-out hover:scale-105"
    >
      <div className="relative flex items-center  space-x-12">
        <AvatarCard avatar={avatar} />
        <p className="flex-1 pl-12 text-lg font-semibold text-black">{name}</p>
      </div>
    </Link>
  );
});

export default Groups;
