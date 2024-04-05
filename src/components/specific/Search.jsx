import React, { useEffect, useState } from "react";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../constants/sampleData";
import { useTheme } from "../../hooks/useTheme";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/hook";

const Search = ({ onClose }) => {
  const { themeMode } = useTheme();
  const [search, setSearch] = useState("");
  // redux
  const dispatch = useDispatch();
  const { isSearch } = useSelector((state) => state.misc);

  // query and hooks
  const [searchUser] = useLazySearchUserQuery("");
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation,
  );

  const [users, setUsers] = useState([]);

  // sending friend req
  const addFriendhandler = async (id) => {
    // console.log(id);
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  // close search box
  const onCloseSearch = () => {
    dispatch(setIsSearch(false));
  };

  useEffect(() => {
    // using concept of debouncing
    const timeOutId = setTimeout(() => {
      searchUser(search)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search]);
  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center  ${themeMode === "dark" ? "bg-gray-900 bg-opacity-50" : ""}`}
    >
      <div
        className={`w-96 rounded-lg ${themeMode === "dark" ? "bg-gray-800" : "bg-white"} p-8 text-${themeMode === "dark" ? "white" : "black"}`}
      >
        <div className="flex justify-end">
          <button
            onClick={onCloseSearch} // Call onClose function when the button is clicked
            className={`text-gray-500 hover:text-orange-400 ${themeMode === "dark" ? "text-white" : "text-black"} focus:outline-none`}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        <h2
          className={`mb-4 text-center text-xl font-semibold ${themeMode === "dark" ? "text-white" : "text-black"}`}
        >
          Find people
        </h2>
        <input
          type="text"
          placeholder="Search..."
          className={`mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none ${themeMode === "dark" ? "bg-gray-700 text-white" : ""}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="space-y-2 overflow-y-auto">
          {users.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={addFriendhandler}
              handlerIsLoading={isLoadingSendFriendRequest}
              themeMode={themeMode}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
