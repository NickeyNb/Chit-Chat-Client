import React from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useTheme } from "../../hooks/useTheme";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
const Notifications = ({ onClose }) => {
  const { themeMode } = useTheme();

  // redux
  const dispatch = useDispatch();
  const { isNotification } = useSelector((state) => state.misc);

  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  // add friend
  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });

    onClose();
  };

  useErrors([{ error, isError }]);
  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center ${themeMode === "dark" ? "bg-gray-900 bg-opacity-50" : ""}`}
    >
      <div
        className={`max-w-2xl rounded-lg ${themeMode === "dark" ? "bg-gray-800 text-white" : "bg-white"} p-8`}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose} // Call onClose function when the button is clicked
            className={`text-gray-500 hover:text-orange-400 ${themeMode === "dark" ? "text-white" : "text-black"} focus:outline-none`}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        <h2
          className={`mb-4 text-center text-xl font-semibold ${themeMode === "dark" ? "text-white" : "text-black"}`}
        >
          Notifications
        </h2>
        {isLoading ? (
          <div>Load...</div>
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests?.map(({ sender, _id }) => (
                <NotificationItem
                  key={_id}
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  themeMode={themeMode} // Pass theme mode to child component
                />
              ))
            ) : (
              <p
                className={`text-center ${themeMode === "dark" ? "text-white" : "text-black"}`}
              >
                0 Notifications
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NotificationItem = ({ sender, _id, handler, themeMode }) => {
  const { name, avatar } = sender;

  return (
    <div className="flex items-center border-b border-gray-200 py-2">
      <img src={avatar} alt={name} className="mr-4 h-10 w-10 rounded-full" />
      <p
        className={`flex-grow overflow-hidden whitespace-nowrap ${themeMode === "dark" ? "text-white" : "text-black"}`}
      >
        <span className="text-orange-500">{name}</span>
        {` sent you a friend request.`}
      </p>
      <div className="ml-2 flex space-x-2">
        <button
          className={`mr-2 rounded border ${themeMode === "dark" ? "border-gray-500 text-white hover:bg-gray-700 hover:font-semibold hover:text-white" : "border-red-500 text-red-500 hover:bg-red-500  hover:font-semibold hover:text-white"} px-4 py-2 font-light hover:text-white`}
          onClick={() => handler({ _id, accept: false })}
        >
          Reject
        </button>
        <button
          className={`rounded ${themeMode === "dark" ? "bg-green-500" : "bg-green-500"} px-4 py-2 font-bold text-white hover:bg-green-700`}
          onClick={() => handler({ _id, accept: true })}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default Notifications;
