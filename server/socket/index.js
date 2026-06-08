export const initSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join_kitchen', () => socket.join('kitchen'));
    socket.on('join_order', (orderId) => socket.join(`order:${orderId}`));
    socket.on('leave_order', (orderId) => socket.leave(`order:${orderId}`));
  });
};
