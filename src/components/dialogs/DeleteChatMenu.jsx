import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import { AiOutlineDelete, AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc,
  );

  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation,
  );

  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation,
  );

  const isGroup = selectedDeleteChat.groupChat;

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
  };

  const deleteChatHandler = () => {
    closeHandler();
    deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
  };

  useEffect(() => {
    if (deleteChatData || leaveGroupData) navigate("/");
  }, [deleteChatData, leaveGroupData]);

  return (
    <div
      className={`${isDeleteMenu ? "block" : "hidden"} absolute z-50 rounded-md bg-white shadow-md`}
    >
      <div
        className="flex w-40 cursor-pointer items-center justify-start px-3 py-2"
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
      >
        {isGroup ? (
          <>
            <AiOutlineLogout className="mr-2" />
            <span>Leave Group</span>
          </>
        ) : (
          <>
            <AiOutlineDelete className="mr-2" />
            <span>Delete Chat</span>
          </>
        )}
      </div>
      <span onClick={closeHandler} className="ml-4 cursor-pointer">
        x
      </span>
    </div>
  );
};

export default DeleteChatMenu;
