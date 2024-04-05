import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../constants/sampleData";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../socket";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../utils/features";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

const AppLayout = ({ children }) => {
  const { themeMode } = useTheme();
  const params = useParams();
  const chatId = params.chatId;

  const navigate = useNavigate();
  const deleteMenuAnchor = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // socket
  const socket = getSocket();
  // console.log(socket.id);
  // redux
  const dispatch = useDispatch();
  const { isMobile } = useSelector((state) => state.misc);
  const { user } = useSelector((state) => state.auth);
  const { newMessagesAlert } = useSelector((state) => state.chat);

  // query
  const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
  // console.log(data); // my-chats

  // using errors
  useErrors([{ isError, error }]);

  // value change hone mei save
  useEffect(() => {
    getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
  }, [newMessagesAlert]);

  // handle delete chat (right-click) => onContextMenu
  const handleDeleteChat = (e, chatId, groupChat) => {
    dispatch(setIsDeleteMenu(true));
    dispatch(setSelectedDeleteChat({ chatId, groupChat }));
    deleteMenuAnchor.current = e.currentTarget;
  };

  const handleMobileClose = () => dispatch(setIsMobile(false));

  //
  const newMessageAlertListener = useCallback(
    (data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));
    },
    [chatId],
  );

  const newRequestListener = useCallback(() => {
    dispatch(incrementNotification());
  }, [dispatch]);

  const refetchListener = useCallback(() => {
    refetch();
    navigate("/");
  }, [refetch, navigate]);

  const onlineUsersListener = useCallback((data) => {
    setOnlineUsers(data);
  }, []);

  const eventHanlders = {
    [NEW_MESSAGE_ALERT]: newMessageAlertListener,
    [NEW_REQUEST]: newRequestListener,
    [REFETCH_CHATS]: refetchListener,
    [ONLINE_USERS]: onlineUsersListener,
  };

  useSocketEvents(socket, eventHanlders);
  return (
    <div
      className={`flex h-screen flex-col ${themeMode === "dark" ? "bg-gray-800 text-white" : ""}`}
    >
      <Title />
      <Header />
      <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

      {isLoading ? (
        <div>Load...</div>
      ) : (
        isMobile && (
          <div className="absolute top-12 flex h-full w-72 flex-col  bg-white">
            <div className="cursor-pointer" onClick={handleMobileClose}>
              X
            </div>
            <ChatList
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </div>
        )
      )}
      <div className="flex-1 overflow-y-auto">
        <div className="grid h-full grid-cols-12">
          <div className="col-span-4 hidden h-[100%] overflow-auto  px-2 sm:block md:col-span-3">
            {isLoading ? (
              <div>"Haha"</div>
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </div>
          <div className="col-span-12  bg-gray-200 sm:col-span-8 md:col-span-9 lg:col-span-9">
            {/* Pass chatId as a prop to children */}
            {/* {React.Children.map(children, (child) => {
              return React.cloneElement(child, { chatId: chatId });
            })} */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
