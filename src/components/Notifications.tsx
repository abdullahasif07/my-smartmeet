import { useContext } from 'react';

import { SocketContext } from '@/context/socket';
import { Button } from './ui/button';

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext)!;

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div className='flex justify-around'>
          <h1>{call.name} is calling:</h1>
          <Button onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;
