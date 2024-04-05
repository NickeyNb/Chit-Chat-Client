import React, { memo } from "react";
import { Link } from "react-router-dom";
import AvatarCard from "./AvatarCard";
import { useTheme } from "../../hooks/useTheme";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const { themeMode } = useTheme();
  const bgColor = sameSender ? `black` : "unset";
  const color = sameSender ? "white" : "unset";

  return (
    <Link
      to={`/chat/${_id}`}
      className={`hover:bg-gray-200 ${themeMode === "dark" ? "hover:text-black" : ""}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <div
        className={`relative flex items-center justify-between gap-4 p-4 ${themeMode === "dark" ? "bg-gray-800 text-white" : ""}`}
        style={{ backgroundColor: bgColor, color: color }}
      >
        <AvatarCard avatar={avatar} />
        <div>
          <p className="font-semibold">{name}</p>
          {newMessageAlert && <p>{newMessageAlert.count} New Message</p>}
        </div>
        {isOnline && (
          <div className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-green-500"></div>
        )}
      </div>
    </Link>
  );
};

export default memo(ChatItem);
