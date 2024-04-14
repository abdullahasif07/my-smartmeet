import { useState, useContext } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

import { SocketContext } from '@/context/socket';

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext)!;
  const [idToCall, setIdToCall] = useState('');

  return (
    <div>
      <div>
        <form>
          <div>
            <div>
              <p>Account Info</p>
              <Input
                value={name} onChange={(e) => setName(e.target.value)} />
              <p>
                {me ? me : 'ID'}
              </p>
            </div>
            <div>
              <p>Make a call</p>
              <Input
                value={idToCall} onChange={(e) => setIdToCall(e.target.value)} />
              {callAccepted && !callEnded ? (
                <Button
                  type='button'
                  onClick={leaveCall}
                >
                  Hang Up
                </Button>
              ) : (
                <Button
                  type='button'
                  onClick={() => callUser(idToCall)}
                >
                  Call
                </Button>
              )}
            </div>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
