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
import { AGORA_APP_ID, BASE_URL } from "@/constants";
import { Button } from "./ui/button";
import { Camera, CameraOff, Mic, MicOff, LogOut, Presentation, Send, ScreenShareOff, ScreenShare, Speech } from "lucide-react";
import { toast } from "sonner";
import io from 'socket.io-client';
import { useAppSelector } from '@/app/hooks';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAskGPTMutation } from '@/services/message/messageApiSlice';



/**
 * color palette
 * - 023047
 * - 548C2F
 * - F2DCA6
 * - EB7547
 */

const socket = io(BASE_URL);

type MessageType = {
  msg: string,
  user: string,
  isTTS: boolean,
  timestamp: Date,
}

const AskGPT = () => {

  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')

  const [askGPTApi, { isLoading }] = useAskGPTMutation();


  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
            <title>OpenAI icon</title>
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className='h-96 flex flex-col'>
        <DialogTitle className='text-center text-xl font-semibold'>Have any query? Ask AI</DialogTitle>
        <div className='flex flex-col gap-2'>
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Ask me anything'
              className='w-full'
            />
            <Button onClick={async () => {
              try {
                const res = await askGPTApi({
                  message: query
                }).unwrap();
                console.log('askgpt', res);
                setResponse(res.response);
                setQuery('');
                toast.success("Your query has been answered! 🚀")
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                toast.error(
                  error?.data?.message || error.error || 'Error: Something went wrong!'
                );
                console.log(error);
              }
            }}
              disabled={isLoading}
            >
              Ask GPT
            </Button>
          </div>
          {
            response && (
              <div className='h-48 overflow-y-scroll'>{response}</div>
            )
          }
        </div>
      </DialogContent>
    </Dialog>

  )
}

const ChatFunctionality = ({ channelName }: { channelName: string }) => {
  const user = useAppSelector(state => state.auth.user?.account.name);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.emit('join channel', channelName, user);

    socket.on('chat message', (message: MessageType) => {
      if (message.isTTS) {
        const utterance = new SpeechSynthesisUtterance(message.msg);
        if (user !== message.user)
          window.speechSynthesis.speak(utterance);
      }
      else {
        setMessages(messages => [...messages, message]);
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
        <AskGPT />
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