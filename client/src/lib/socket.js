import { io } from 'socket.io-client';
import { API_ORIGIN } from './config';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_ORIGIN || '/', { autoConnect: false });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
};
