import React from "react";
import ChatItem from "../shared/ChatItem";
import { useTheme } from "../../hooks/useTheme";

const ChatList = ({
  w = "w-full",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  const { themeMode } = useTheme();
  // console.log("Online users", onlineUsers);
  return (
    <div
      className={`flex flex-col ${w} overflow-auto  py-2 ${themeMode === "dark" ? "bg-gray-800 text-white" : ""}`}
    >
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;
        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id,
        );
        const isOnline = members?.some((member) => onlineUsers.includes(_id));
        // console.log(isOnline);
        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </div>
  );
};

export default ChatList;
