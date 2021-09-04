import { CLIENT_BASE_URL } from '../../../../conf.js';
import { SOCKET_EVENT } from '../../../../common/enums/index.js';
import { Server } from 'socket.io';

const socketToUserMap = new Map();
const userToSocketMap = new Map();
let io;
const initialize = server => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: CLIENT_BASE_URL,
        methods: ['GET', 'POST'],
      },
    });
    io.on('connection', socket => {
      socket.on(SOCKET_EVENT.CONNECTED_USER, userId => {
        onUserConnected(socket, userId);
      });
      socket.on('disconnect', reason =>
        onSocketDisconnected(socket, reason),
      );
    });
  }
  return io;
};

const onUserConnected = (socket, userId) => {
  const socketId = socket.id;
  socketToUserMap.set(socketId, userId);
  if (!userToSocketMap.has(userId)) {
    userToSocketMap.set(userId, new Set([socketId]));
  } else {
    userToSocketMap.get(userId).add(socketId);
  }
};

const onSocketDisconnected = socket => {
  const socketId = socket.id;
  const userId = socketToUserMap.get(socketId);

  socketToUserMap.delete(socketId);
  const sockets = userToSocketMap.get(userId);
  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) {
      userToSocketMap.delete(userId);
    }
  }
};

const emit = (eventName, userId, message) => {
  if (!io) {
    // eslint-disable-next-line no-console
    console.error('You need to call initialize before emitting!');
  } else {
    sockets = userToSocketMap.get(userId);
    if (sockets) {
      sockets.forEach(socket =>
        io.to(socket).emit(eventName, message),
      );
    }
  }
};
export { emit, initialize };
