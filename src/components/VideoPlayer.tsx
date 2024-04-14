import { useContext } from 'react';

import { SocketContext } from '@/context/socket';

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext)!;

  return (
    <div className='flex gap-8 items-center my-8'>
      {stream && (
        <div className='w-1/3 h-1/3 rounded border'>
          <div>
            <p className='text-lg font-medium'>{name || 'Name'}</p>
            <video playsInline muted ref={myVideo} autoPlay />
          </div>
        </div>
      )}
      {callAccepted && !callEnded && (
        <div className='w-1/3 h-1/3 rounded border'>
          <div>
            <p className='text-lg font-medium'>{call.name || 'Name'}</p>
            <video playsInline ref={userVideo} autoPlay />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
