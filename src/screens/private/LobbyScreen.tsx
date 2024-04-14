import { useEffect, useState, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Lobby = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({
          video: videoEnabled,
          audio: audioEnabled,
        });
        setStream(currentStream);
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = currentStream;
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    getMedia();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [videoEnabled, audioEnabled]);

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
  };

  return (
    <div className='flex items-center grow flex-col gap-6'>
      <div>
        <video
          autoPlay
          playsInline
          muted
          className='h-[600px]'
          ref={videoElementRef} />
      </div>
      <div className='flex gap-8 grow'>
        <button onClick={toggleVideo}>
          {videoEnabled ? <CameraOff className='w-10 h-10 stroke-indigo-600' /> : <Camera className='w-10 h-10 stroke-indigo-600' />}
        </button>
        <button onClick={toggleAudio}>
          {audioEnabled ? <MicOff className='w-10 h-10 stroke-indigo-600' /> : <Mic className='w-10 h-10 stroke-indigo-600' />}
        </button>

        <Button>Join Meeting</Button>
        <Button
          variant='destructive'
        >Leave Meeting</Button>
      </div>
    </div>
  );
};

export default Lobby;

