import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import {
  AiOutlineFileImage,
  AiOutlineAudio,
  AiOutlineVideoCamera,
  AiOutlineFile,
} from "react-icons/ai";
import toast from "react-hot-toast";

const FileMenu = ({ anchorE1, chatId }) => {
  // redux
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  // reference to all
  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  // file change handler
  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    // Fetching
    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);
      // console.log("res.data", res.data);
      if (res.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`Failed to send ${key}`, { id: toastId });
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <div
      className={`${isFileMenu ? "block" : "hidden"} absolute bottom-12   z-50 w-32 rounded-lg bg-white shadow-md`}
    >
      <ul className="flex flex-col gap-2 px-1 py-2">
        <li
          className="flex cursor-pointer items-center p-1 hover:bg-gray-200"
          onClick={selectImage}
        >
          <AiOutlineFileImage title="Image" className="mr-2" />
          <span>Image</span>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
            onChange={(e) => fileChangeHandler(e, "Images")}
            ref={imageRef}
          />
        </li>
        <li
          className="flex cursor-pointer items-center p-1 hover:bg-gray-200"
          onClick={selectAudio}
        >
          <AiOutlineAudio title="Audio" className="mr-2" />
          <span>Audio</span>
          <input
            type="file"
            multiple
            accept="audio/mpeg, audio/wav"
            className="hidden"
            onChange={(e) => fileChangeHandler(e, "Audios")}
            ref={audioRef}
          />
        </li>
        <li
          className="flex cursor-pointer items-center p-1 hover:bg-gray-200"
          onClick={selectVideo}
        >
          <AiOutlineVideoCamera title="Video" className="mr-2" />
          <span>Video</span>
          <input
            type="file"
            multiple
            accept="video/mp4, video/webm, video/ogg"
            className="hidden"
            onChange={(e) => fileChangeHandler(e, "Videos")}
            ref={videoRef}
          />
        </li>
        <li
          className="flex cursor-pointer items-center p-1 hover:bg-gray-200"
          onClick={selectFile}
        >
          <AiOutlineFile title="File" className="mr-2" />
          <span>File</span>
          <input
            type="file"
            multiple
            accept="*"
            className="hidden"
            onChange={(e) => fileChangeHandler(e, "Files")}
            ref={fileRef}
          />
        </li>
      </ul>
    </div>
  );
};

export default FileMenu;
