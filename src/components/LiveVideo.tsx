import { Fragment, useEffect, useRef, useState } from 'react';
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
  useLocalScreenTrack,
} from "agora-rtc-react";
import { AGORA_APP_ID } from "@/constants";
import { Button } from "./ui/button";
import { Camera, CameraOff, Mic, MicOff, LogOut, Presentation, Send, ScreenShareOff, ScreenShare, Speech } from "lucide-react";
import { toast } from "sonner";
import io from 'socket.io-client';
import { useAppSelector } from '@/app/hooks';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';


/**
 * color palette
 * - 023047
 * - 548C2F
 * - F2DCA6
 * - EB7547
 */

const socket = io('http://localhost:5000');

type MessageType = {
  msg: string,
  user: string,
  isTTS: boolean,
  timestamp: Date,
}

const ChatFunctionality = ({ channelName }: { channelName: string }) => {
  const user = useAppSelector(state => state.auth.user?.account.name);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.emit('join channel', channelName, user);

    socket.on('chat message', (message: MessageType) => {
      setMessages(messages => [...messages, message]);
      if (message.isTTS) {
        const utterance = new SpeechSynthesisUtterance(message.msg);
        window.speechSynthesis.speak(utterance);
      }
    });

    return () => {
      socket.off('chat message');
    };
  }, [channelName, user]);

  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = (isTTS = false) => {
    if (input.trim()) {
      socket.emit('chat message', channelName, {
        msg: input,
        user,
        isTTS
      });
      setInput('');
    }
  };

  return (
    <div className='bg-zinc-200 max-w-md w-full py-4 px-8 flex flex-col justify-between border border-black rounded overflow-y-scroll max-h-[635px] gap-8'>
      <div className='grid gap-2'>
        <h2 className='text-2xl font-bold text-center'>Chat</h2>
        <ul className='flex flex-col'>
          {messages.map((msg, index) => (
            <Fragment key={index}>
              <Separator className='bg-black h-px' />
              <li className={cn('flex gap-2 items-center py-2',
                user === msg.user ? 'flex-row-reverse' : '')}>
                <div className={cn("flex justify-center items-center w-12 h-12 rounded-full border text-white",
                  user === msg.user ? 'bg-[#EB7547]' : 'bg-[#023047]')}>
                  {
                    msg.user.split(' ').map((name) => name[0].toUpperCase()).join('')
                  }
                </div>
                <p>
                  {msg.msg}
                </p>
              </li>
            </Fragment>
          ))}
          <div ref={messagesEndRef} />
        </ul>
        <Separator className='bg-black h-px' />
      </div>
      <div className='flex gap-2'>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={() => sendMessage()}>
          <Send />
        </Button>
        <Button onClick={() => sendMessage(true)}>
          <Speech />
        </Button>
      </div>
    </div>
  )
}



export const LiveVideo = () => {
  const appId = AGORA_APP_ID;
  const { channelName } = useParams() //pull the channel name from the param

  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);

  // track the mic/video state - Turn on Mic and Camera On
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const [screenShare, setScreenShare] = useState(false);

  // get local video and mic tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const { screenTrack } = useLocalScreenTrack(screenShare, {}, "disable");

  const toggleScreenShare = () => {
    setScreenShare(current => !current);
  };

  const navigate = useNavigate()

  useJoin(
    {
      appid: appId,
      channel: channelName!,
      token: null
    },
    activeConnection,
  );

  usePublish(screenShare ? [localMicrophoneTrack, screenTrack] : [localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

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
            videoTrack={screenShare ? screenTrack : localCameraTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            playAudio={micOn}
            playVideo={cameraOn}
            className='w-full h-full'
          />
        </div>
        <ChatFunctionality channelName={channelName || ''} />
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
          <Button onClick={toggleScreenShare}>
            {screenShare ? <ScreenShareOff /> : <ScreenShare />}
          </Button>
          <Button
            onClick={
              () => navigate(`/whiteboard?channelName=${channelName}`)
            }
          >
            <Presentation size={24} />
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