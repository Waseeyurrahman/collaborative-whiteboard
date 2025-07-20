const Drawing = require('../models/Drawing');

const userCursors = {};

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(' Socket connected:', socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      const count = io.sockets.adapter.rooms.get(roomId)?.size || 1;
      io.to(roomId).emit('user-count', count);
    });

    socket.on('draw-start', (data) => {
      socket.to(data.roomId).emit('draw-start', data);
    });

    socket.on('draw-move', (data) => {
      socket.to(data.roomId).emit('draw-move', data);
    });

    socket.on('draw-end', async (data) => {
      socket.to(data.roomId).emit('draw-end', data);
      try {
        let doc = await Drawing.findOne({ roomId: data.roomId });
        if (!doc) doc = new Drawing({ roomId: data.roomId, strokes: [] });
        doc.strokes.push({
          path: data.path || [],
          color: data.color,
          strokeWidth: data.strokeWidth,
        });
        await doc.save();
      } catch (err) {
        console.error('Error saving drawing:', err);
      }
    });

    socket.on('cursor-move', ({ x, y }) => {
      const roomsJoined = [...socket.rooms].filter((r) => r !== socket.id);
      roomsJoined.forEach((roomId) => {
        userCursors[socket.id] = { x, y };
        socket.to(roomId).emit('update-cursors', userCursors);
      });
    });

    socket.on('clear-canvas', async (data) => {
        const roomId = typeof data === 'string' ? data : data.roomId;
      
        try {
          await Drawing.findOneAndDelete({ roomId });
          io.to(roomId).emit('clear-canvas');
        } catch (err) {
          console.error(' Error clearing canvas:', err);
        }
      });

      socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        const count = io.sockets.adapter.rooms.get(roomId)?.size || 0;
        io.to(roomId).emit('user-count', count);
      });
      

      
      

    socket.on('disconnecting', () => {
      for (const roomId of socket.rooms) {
        socket.to(roomId).emit('user-count', (io.sockets.adapter.rooms.get(roomId)?.size || 1) - 1);
      }
      delete userCursors[socket.id];
    });
  });
}

module.exports = socketHandler;
