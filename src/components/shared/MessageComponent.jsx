import moment from "moment";
import React, { memo } from "react";
import { fileFormat } from "../../utils/features";
import RenderAttachment from "./RenderAttachement";
import { useTheme } from "../../hooks/useTheme";

const MessageComponent = ({ message, user, darkMode }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  // theme
  const { themeMode } = useTheme();
  // Read chat
  const chatContentRead = () => {
    // console.log("haha");
    // speakContent(content);
    const synth = window.speechSynthesis;
    // console.log(synth);
    const utterance = new SpeechSynthesisUtterance(content);
    // console.log(utterance);
    synth.speak(utterance);
  };

  return (
    <div className={`flex justify-${sameSender ? "end" : "start"} mb-10`}>
      <div
        className={`message-container cursor-pointer ${sameSender ? "sender" : "recipient"} ${themeMode === "dark" ? "border-gray-600 bg-gray-800 text-white" : "border-green-100 bg-green-100 text-black"} space-y-2 rounded-md border  px-4`}
        onClick={chatContentRead}
      >
        {/* Display sender name if not the same sender */}
        {!sameSender && (
          <div className="sender-name mb-1 font-semibold">{sender.name}</div>
        )}
        {/* Display message content */}
        <div className="message-content mb-2">{content}</div>
        {/* Attachments */}
        {attachments.length > 0 &&
          attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);
            return (
              <div key={index}>
                <a
                  href={url}
                  target="_blank"
                  download
                  className={`attachment-link ${darkMode ? "text-gray-300" : "text-black"}`}
                >
                  {RenderAttachment(file, url)}
                </a>
              </div>
            );
          })}
        {/* Display time ago */}
        <div className="message-time text-xs text-gray-500">{timeAgo}</div>
      </div>
    </div>
  );
};

export default memo(MessageComponent);
