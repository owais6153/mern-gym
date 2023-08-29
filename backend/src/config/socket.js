import { Server } from "socket.io";

let io;

export const socket = {
  init: (httpServer) => {
    io = new Server(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};

export const emit = async (event, body) => {
  return await socket.getIO().emit(event, body);
};
