// VideoCallPage.js
import React, { useContext } from "react";
import VideoCall from "../components/extras/VideoCall";
import Header from "../components/layout/Header";
import { BiVideo } from "react-icons/bi";
import { useTheme } from "../hooks/useTheme";

const VideoCallPage = () => {
  const { themeMode } = useTheme();

  return (
    <div
      className={`video-call-page ${themeMode === "dark" ? "bg-gray-800" : "bg-gray-100"} h-screen`}
    >
      <Header />
      <div
        className={`video-call-content ${themeMode === "dark" ? "dark" : "light"}`}
      >
        <h1
          className={`video-call-heading flex items-center text-2xl font-bold ${themeMode === "dark" ? "text-gray-300" : "text-gray-800"}`}
        >
          <BiVideo
            className={`mr-2 ${themeMode === "dark" ? "text-blue-400" : "text-blue-500"}`}
          />{" "}
          Video Call
        </h1>
        <VideoCall />
      </div>
    </div>
  );
};

export default VideoCallPage;
