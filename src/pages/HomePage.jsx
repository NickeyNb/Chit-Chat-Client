import React from "react";
import { FiMessageCircle, FiUsers } from "react-icons/fi";
import AppLayout from "../components/layout/AppLayout";
import { useTheme } from "../hooks/useTheme"; // Import useTheme hook to get the theme mode

const HomePage = () => {
  const { themeMode } = useTheme(); // Get the current theme mode

  return (
    <AppLayout>
      <div
        className={`flex h-full items-center justify-center ${themeMode === "dark" ? "bg-gray-600" : "bg-gray-300"}`}
      >
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Welcome to Chit-Chat!</h1>
          <p className="mb-8 text-lg">Start chatting with your friends.</p>
          <div className="flex justify-center space-x-8">
            <div className="relative transform transition duration-300 ease-in-out hover:scale-110">
              <FiUsers
                className={`cursor-pointer text-4xl ${themeMode === "dark" ? "text-gray-300 hover:text-gray-400" : "text-gray-500 hover:text-gray-700"}`}
              />
              <span
                className={`absolute right-0 top-0 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full ${themeMode === "dark" ? "bg-gray-700" : "bg-orange-500"} text-xs text-white`}
              >
                3
              </span>
            </div>
            <div className="relative transform transition duration-300 ease-in-out hover:scale-110">
              <FiMessageCircle
                className={`cursor-pointer text-4xl ${themeMode === "dark" ? "text-gray-300 hover:text-gray-400" : "text-gray-500 hover:text-gray-700"}`}
              />
              <span
                className={`absolute right-0 top-0 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full ${themeMode === "dark" ? "bg-gray-700" : "bg-orange-500"} text-xs text-white`}
              >
                5
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;
