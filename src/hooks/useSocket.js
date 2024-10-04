import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const useSocket = () => {
  const user = useSelector((state) => state.user.user);

  const socket = useMemo(() => {
    return io("http://localhost:8000", {
      query: {
        userId: user?.user?._id
      }
    });
  }, [user]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return socket;
};

export default useSocket;
