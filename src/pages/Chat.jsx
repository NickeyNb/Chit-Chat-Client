import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiPaperclip, FiSend } from "react-icons/fi";
import { FaKeyboard } from "react-icons/fa";
import AppLayout from "../components/layout/AppLayout";
import FileMenu from "../components/dialogs/FileMenu";
import { sampleMessage } from "../components/constants/sampleData";
import MessageComponent from "../components/shared/MessageComponent";
import { useTheme } from "../hooks/useTheme";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import Draggable from "react-draggable";
import EmojiPicker from "emoji-picker-react";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useNavigate, useParams } from "react-router-dom";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useDispatch, useSelector } from "react-redux";

import { useInfiniteScrollTop } from "6pp";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";

const Chat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const [input, setInput] = useState(""); // State to manage keyboard input
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // State to manage keyboard visibility
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false); // State to manage emoji picker visibility

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const { themeMode } = useTheme();

  const params = useParams();
  const chatId = params.chatId;
  // console.log("Chat id is ", chatId);

  // redux
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isFileMenu } = useSelector((state) => state.misc);

  // socket
  const socket = getSocket();
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  // use infinite scroll
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages,
  );
  // console.log("Old", oldMessages);

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];
  // console.log("Old message", oldMessagesChunk.data);
  // console.log(messages);
  const members = chatDetails?.data?.chat?.members;
  // console.log(members);

  // message on change
  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const onChangeMessage = (message) => {
    setMessage(message);
  };

  const toggleKeyboard = (e) => {
    e.preventDefault();
    setIsKeyboardOpen(!isKeyboardOpen);
    setIsEmojiPickerOpen(false); // Close emoji picker when opening the keyboard
  };

  const toggleEmojiPicker = (e) => {
    e.preventDefault();
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
    setIsKeyboardOpen(false); // Close keyboard when opening the emoji picker
  };

  const handleEmojiClick = (event) => {
    const emoji = event.emoji;
    // console.log(emoji);
    setMessage((prevInput) => prevInput + emoji);
  };

  // open attachment
  const handleFileOpen = (e) => {
    if (isFileMenu) {
      dispatch(setIsFileMenu(false));
    } else {
      dispatch(setIsFileMenu(true));
    }
    setFileMenuAnchor(e.currentTarget);
  };

  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;
    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) {
      return navigate("/");
    }
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId],
  );
  // typing listeners
  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId],
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId],
  );
  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId],
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  useSocketEvents(socket, eventHandler);
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];
  // console.log("all messages", allMessages);
  return chatDetails.isLoading ? (
    <div>Load</div>
  ) : (
    <AppLayout>
      <div
        className={`flex w-full flex-col justify-between ${
          themeMode === "dark" ? "bg-gray-600 text-white" : ""
        }`}
      >
        <div
          ref={containerRef}
          className={`box-border h-[83vh] space-y-4 overflow-y-auto p-4 ${
            themeMode === "dark" ? "bg-gray-600 text-white" : ""
          }`}
        >
          {allMessages.map((i, idx) => (
            <MessageComponent key={idx} message={i} user={user} />
          ))}
          {userTyping && <TypingLoader />}
          <div ref={bottomRef} />
        </div>
        <form className="py-1" onSubmit={submitHandler}>
          <div className="flex h-full items-center px-4">
            <button
              className={`rounded-full bg-gray-300 p-2 text-center text-black hover:bg-orange-400`}
              onClick={toggleKeyboard}
            >
              <FaKeyboard title="On-Screen Keyboard" />
            </button>
            <button
              className={`ml-2 rounded-full bg-gray-300 p-2 text-center text-black hover:bg-orange-400`}
              onClick={toggleEmojiPicker}
            >
              <BsFillEmojiSunglassesFill title="emoji's" />
            </button>
            <button
              onClick={handleFileOpen}
              className="ml-2 rounded-full bg-gray-300 p-2 hover:bg-orange-400"
            >
              <FiPaperclip className="text-gray-600" />
            </button>
            <input
              type="text"
              value={message}
              onChange={messageOnChange}
              className={`ml-4 flex-grow rounded-md border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none ${
                themeMode === "dark" ? "bg-gray-700 text-white" : ""
              }`}
              placeholder="Type a message..."
            />
            <button className="ml-2 rounded-full bg-orange-500 p-2 text-center text-white hover:bg-orange-600">
              <FiSend title="Send Message" />
            </button>
          </div>
        </form>
        {isKeyboardOpen && (
          <Draggable handle=".handle">
            <div className="absolute top-0">
              <div className="handle">
                {" "}
                <Keyboard
                  onChange={onChangeMessage}
                  inputName="message"
                  theme="hg-theme-default"
                  layoutName="default"
                />
              </div>
            </div>
          </Draggable>
        )}
        {isEmojiPickerOpen && (
          <div className="absolute bottom-0 right-0 mb-16 mr-4">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={`${themeMode === "dark" ? "dark" : "light"}`}
              skinTonesDisabled
              searchDisabled
            />
          </div>
        )}
        <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
      </div>
    </AppLayout>
  );
};

export default Chat;
