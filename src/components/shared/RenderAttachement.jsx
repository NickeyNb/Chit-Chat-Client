import React from "react";
import { transformImage } from "../../utils/features";
import { HiOutlineDocumentDownload } from "react-icons/hi";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"200px"} controls />;
    case "audio":
      return <audio src={url} preload="none" controls></audio>;
    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="Attachment"
          width={"200px"}
          height={"150px"}
          style={{
            objectFit: "contain",
          }}
        />
      );
    default:
      return (
        <div className="flex items-center justify-center">
          <HiOutlineDocumentDownload className="h-8 w-8 text-gray-500" />
        </div>
      );
  }
};

export default RenderAttachment;
