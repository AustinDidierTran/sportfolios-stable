const { CLIENT_BASE_URL } = require('../../../../conf');
const socketToUserMap = new Map();
const userToSocketMap = new Map();
let io;
const initialize = server => {
  io = require('socket.io')(server, {
    cors: {
      origin: CLIENT_BASE_URL,
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', socket => {
    console.log(`new connection: ${socket.id}`);

    socket.on('userConnected', userId => {
      onUserConnected(socket, userId);
    });
    socket.on('message', data => {
      onMessage(socket, data);
    });
    socket.on('disconnect', reason =>
      onSocketDisconnected(socket, reason),
    );
  });
  return io;
};

const onUserConnected = (socket, userId) => {
  console.log({ userId });
  const socketId = socket.id;
  socketToUserMap.set(socketId, userId);
  if (!userToSocketMap.has(userId)) {
    userToSocketMap.set(userId, [socketId]);
  } else {
    userToSocketMap.get(userId).add(socketId);
  }
};

const onSocketDisconnected = (socket, reason) => {
  console.log(`${socket.id} disconnected because: ${reason}`);
  const socketId = socket.id;
  const userId = socketToUserMap.get(socketId);

  socketToUserMap.delete(socketId);
  const sockets = userToSocketMap.get(userId);
  sockets.delete(socketId);
  if (sockets.size === 0) {
    userToSocketMap.delete(userId);
  }
};

const onMessage = (socket, data) => {
  console.log({ data });
};

const emit = (eventName, userId, message) => {
  if (!io) {
    // eslint-disable-next-line no-console
    console.error('You need to call initialize before emitting!');
  } else {
    sockets = userToSocketMap.get(userId);
    sockets.forEach(socket =>
      io.to(socket.id).emit(eventName, message),
    );
    io.to();
  }
};
module.exports = { emit, initialize };
