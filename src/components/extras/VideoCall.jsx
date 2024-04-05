import React, { useState, useEffect, useRef, useContext } from "react";
import { useTheme } from "../../hooks/useTheme";

const VideoCall = () => {
  const { themeMode } = useTheme();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();

  useEffect(() => {
    const initializeMediaDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeMediaDevices();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartCall = async () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    // Add local stream to peer connection
    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) =>
          peerConnectionRef.current.addTrack(track, localStream),
        );
    }

    // Set up event listeners for incoming tracks and ICE candidates
    peerConnectionRef.current.addEventListener("track", handleTrackEvent);
    peerConnectionRef.current.addEventListener(
      "icecandidate",
      handleICECandidateEvent,
    );

    // Create offer
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    setIsCalling(true);
  };

  const handleTrackEvent = (event) => {
    setRemoteStream(event.streams[0]);
    remoteVideoRef.current.srcObject = event.streams[0];
  };

  const handleICECandidateEvent = (event) => {
    if (event.candidate) {
      // Send ICE candidate to remote peer (via signaling server)
    }
  };

  return (
    <div className={`video-call-container ${themeMode}`}>
      <div className="mb-6 flex justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Local Video</h2>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="h-auto w-full rounded-lg"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Remote Video</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-auto w-full rounded-lg"
          />
        </div>
      </div>
      <div>
        {!isCalling && (
          <button
            onClick={handleStartCall}
            className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Start Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
