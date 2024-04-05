import React, { Suspense, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHamburger,
  FaSearch,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaUser,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineGroupAdd } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useTheme } from "../../hooks/useTheme";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import { server } from "../constants/config";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";

const Search = React.lazy(() => import("../specific/Search"));
const NewGroup = React.lazy(() => import("../specific/NewGroup"));
const Notifications = React.lazy(() => import("../specific/Notifications"));
const Profile = React.lazy(() => import("../specific/Profile"));

const Header = () => {
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { themeMode, darkTheme, lightTheme } = useTheme();

  // redux
  const dispatch = useDispatch();
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc,
  );
  const { notificationCount } = useSelector((state) => state.chat);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    if (themeMode === "dark") {
      lightTheme();
    } else {
      darkTheme();
    }
  };

  const handleMobile = () => {
    dispatch(setIsMobile(true));
  };

  const openSearchDialog = () => {
    dispatch(setIsSearch(true));
  };

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => {
    navigate("/groups");
  };

  // logout
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data.message || "Something went wrong !");
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev); // Toggle profile section state
    if (themeMode === "dark") {
      darkTheme();
    } else {
      lightTheme();
    }
  };

  return (
    <div>
      <div
        className={`flex justify-between p-4 shadow-sm shadow-stone-400 ${themeMode === "dark" ? "bg-gray-800 shadow-sm shadow-white" : "bg-white"}`}
      >
        <div>
          <Link
            to={"/"}
            className="hidden text-xl font-semibold text-orange-500 sm:block"
          >
            Chit-Chat
          </Link>
          <i className="block sm:hidden" onClick={handleMobile} title="Menu">
            <FaHamburger
              className={`${themeMode === "dark" ? "text-white" : "text-black"}`}
            />
          </i>
        </div>
        <div className="flex items-center gap-8">
          <div>
            <i
              className={`cursor-pointer  ${themeMode === "dark" ? "text-white" : "text-black"} hover:text-yellow-500`}
              onClick={openSearchDialog}
              title="Search"
            >
              <FaSearch />
            </i>
          </div>
          <div>
            <i
              className={`cursor-pointer ${themeMode === "dark" ? "text-white" : "text-black"} hover:text-yellow-500`}
              onClick={openNewGroup}
              title="New Group"
            >
              <MdOutlineGroupAdd />
            </i>
          </div>
          <div>
            <i
              onClick={navigateToGroup}
              title="Groups"
              className={`cursor-pointer ${themeMode === "dark" ? "text-white" : "text-black"} hover:text-yellow-500`}
            >
              <HiUserGroup />
            </i>
          </div>
          <div>
            <i
              onClick={openNotification}
              title="Notifications"
              className={`cursor-pointer ${themeMode === "dark" ? "text-white" : "text-black"} hover:text-yellow-500`}
            >
              <IoMdNotificationsOutline />
              {notificationCount}
            </i>
          </div>
          <div>
            <i
              onClick={toggleTheme}
              title="Toggle Theme"
              className={`cursor-pointer ${themeMode === "dark" ? "text-white" : "text-black"} hover:text-yellow-500`}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </i>
          </div>
          <div>
            <i
              title="Profile"
              className={`cursor-pointer ${themeMode === "dark" ? "text-white" : "text-black"} hover:text-yellow-500`}
              onClick={toggleProfile}
            >
              <FaUser />
            </i>
          </div>
          <div>
            <i
              onClick={logoutHandler}
              title="Logout"
              className={`cursor-pointer ${themeMode === "dark" ? "text-white" : "text-black"} hover:text-yellow-500`}
            >
              <FaSignOutAlt />
            </i>
          </div>
        </div>
      </div>
      {isSearch && (
        <Suspense fallback={<div>Loading...</div>}>
          <Search onClose={() => setIsSearch(false)} />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<div>Loading...</div>}>
          <NewGroup onClose={() => dispatch(setIsNewGroup(false))} />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<div>Loading...</div>}>
          <Notifications onClose={() => dispatch(setIsNotification(false))} />
        </Suspense>
      )}
      {/* Render Profile component if isProfileOpen is true */}
      {isProfileOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <Profile onClose={() => setIsProfileOpen(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default Header;
