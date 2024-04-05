import React from "react";
import { FaTimes } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import moment from "moment";
import { useTheme } from "../../hooks/useTheme";
import { useSelector } from "react-redux";
import { transformImage } from "../../utils/features";

const Profile = ({ onClose }) => {
  const { themeMode } = useTheme();
  const { user } = useSelector((state) => state.auth);

  return (
    <div
      className={`fixed right-0 top-12 z-10 flex flex-col items-center justify-start space-y-4 overflow-y-auto ${themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white"} rounded-lg p-6 shadow-lg`}
      style={{ maxWidth: "320px" }}
    >
      {/* Cross icon for closing the profile section */}
      <button
        onClick={onClose}
        className={`absolute left-2 top-2 text-gray-500 ${themeMode === "dark" ? "text-white" : ""}`}
      >
        <FaTimes size={20} />
      </button>
      <div className="mb-4 rounded-full border-white">
        {/* <FaCircleUser
          size={80}
          color={themeMode === "dark" ? "white" : "gray"}
          className="cursor-pointer"
        /> */}
        <img src={transformImage(user?.avatar?.url)} alt="Profile" />
      </div>
      <ProfileCard
        heading={"Username"}
        text={user?.username}
        themeMode={themeMode}
      />
      <ProfileCard
        heading={"Email"}
        text={"mail@gmail.com"}
        themeMode={themeMode}
        emailLink={true} // Add this prop to indicate it's an email link
      />
      <ProfileCard heading={"Bio"} text={user?.bio} themeMode={themeMode} />
      <ProfileCard heading={"Name"} text={user?.name} themeMode={themeMode} />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        themeMode={themeMode}
      />
    </div>
  );
};

const ProfileCard = ({ text, Icon, heading, themeMode, emailLink }) => (
  <div
    className={`${themeMode === "dark" ? "text-white" : "text-gray-700"} bg-${themeMode === "dark" ? "gray-700" : "gray-100"} flex items-center justify-between rounded-md p-3`}
  >
    {Icon && Icon}
    <div className="ml-3 flex flex-1 flex-col">
      <div className="font-semibold">{heading}</div>
      {/* If it's an email link, render it as a clickable email */}
      {emailLink ? (
        <a href={`mailto:${text}`} className="text-blue-500 hover:underline">
          {text}
        </a>
      ) : (
        <div className="text-sm">{text}</div>
      )}
    </div>
  </div>
);

export default Profile;
