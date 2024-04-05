import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { BiSolidUserRectangle } from "react-icons/bi";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { TbMessageStar } from "react-icons/tb";
import { ImExit } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <MdOutlineDashboard />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <BiSolidUserRectangle />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <BsFillChatSquareTextFill />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <TbMessageStar />,
  },
];

const Sidebar = ({ w = "full" }) => {
  const location = useLocation();
  // redux
  const dispatch = useDispatch();

  // logout handler
  const logoutHandler = () => {
    // console.log("logout");
    dispatch(adminLogout());
  };

  return (
    <div
      className={`flex flex-col w-${w} h-full space-y-12 bg-gray-800 p-12 text-white`}
    >
      <span className="text-lg font-bold">CHIT-CHAT</span>
      <div className="space-y-4">
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex items-center rounded-lg p-4 ${
              location.pathname === tab.path
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            {tab.icon}
            <span className="ml-4">{tab.name}</span>
          </Link>
        ))}
        <button
          onClick={logoutHandler}
          className="flex items-center rounded-lg p-4 hover:bg-gray-700"
        >
          <ImExit />
          <span className="ml-4">Logout</span>
        </button>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  // redux
  const { isAdmin } = useSelector((state) => state.auth);
  const handleMobile = () => {
    setIsMobile(!isMobile);
  };

  const handleClose = () => {
    setIsMobile(false);
  };

  if (!isAdmin) return <Navigate to="/admin" />;
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-12">
      <div className="fixed right-4 top-4 md:hidden">
        <button
          onClick={handleMobile}
          className="rounded-full bg-blue-500 p-2 text-white"
        >
          ☰
        </button>
      </div>
      <div className="col-span-4 hidden md:block lg:col-span-3">
        <Sidebar />
      </div>
      <div className="col-span-12 bg-gray-200 md:col-span-8 lg:col-span-9">
        {children}
      </div>
      {isMobile && (
        <div className=" fixed left-0 top-0 z-50 h-full ">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-2xl text-white"
          >
            X
          </button>
          <Sidebar w="1/2" />
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
