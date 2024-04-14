import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import AgoraRTC, {
  AgoraRTCProvider,
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { AGORA_APP_ID } from "@/constants";
import { Button } from "./ui/button";
import { Camera, CameraOff, Mic, MicOff, LogOut } from "lucide-react";
import { toast } from "sonner";


export const LiveVideo = () => {

  const appId = AGORA_APP_ID;
  // const agoraEngine = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
  const { channelName } = useParams() //pull the channel name from the param

  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);

  // track the mic/video state - Turn on Mic and Camera On
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  // get local video and mic tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  // to leave the call
  const navigate = useNavigate()

  // Join the channel
  useJoin(
    {
      appid: appId,
      channel: channelName!,
      token: null,
    },
    activeConnection,
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  //remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // play the remote user audio tracks
  audioTracks.forEach((track) => track.play());


  return (
    <main className="flex flex-col min-h-screen w-full">
      <div className="flex grow w-full h-full gap-px bg-violet-50 justify-between">
        <div className="w-1/2">
          <RemoteUser user={remoteUsers[0]} className='w-full h-full' />
        </div>
        <div className="w-1/2">
          <LocalUser
            audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            playAudio={micOn}
            playVideo={cameraOn}
            className='w-full h-full'
          />
        </div>
      </div>
      {/* media-controls toolbar component - UI controling mic, camera, & connection state  */}
      <div className="flex items-center gap-3 justify-center w-max mx-auto border px-12 py-2 rounded-lg">
        <div className="flex items-center gap-3">
          <Button onClick={() => setMic(currentValue => !currentValue)}>
            {micOn ? <Mic /> : <MicOff />}
          </Button>
          <Button onClick={() => setCamera(currentValue => !currentValue)}>
            {cameraOn ? <Camera /> : <CameraOff />}
          </Button>
        </div>
        <Button
          variant='destructive'
          onClick={() => {
            setActiveConnection(false)
            navigate('/')
            toast.success('You have left the call')
          }}>
          <LogOut />
        </Button>
      </div >
    </main >
  )
}

export default function Screen() {
  const agoraClient = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

  return (
    <AgoraRTCProvider client={agoraClient}>
      <LiveVideo />
    </AgoraRTCProvider>
  );
}