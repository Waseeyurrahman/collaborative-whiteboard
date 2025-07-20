const express = require('express');
const Room = require('../models/Room');
const Drawing = require('../models/Drawing');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('✅ Collaborative Whiteboard API is working');
  });

router.post('/join', async (req, res) => {
  const { roomId } = req.body;
  try {
    let room = await Room.findOne({ roomId });
    if (!room) room = await Room.create({ roomId });

    const drawingData = await Drawing.findOne({ roomId });
    res.json({ message: 'Room joined', roomId, drawingData });
  } catch (err) {
    console.error('JOIN ROOM ERROR:', err);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Add below your POST /join route
router.get('/:roomId', async (req, res) => {
    const { roomId } = req.params;
  
    try {
      const room = await Room.findOne({ roomId });
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      const drawingData = await Drawing.findOne({ roomId });
      res.json({ roomId, createdAt: room.createdAt, drawingData });
    } catch (err) {
      console.error('GET ROOM ERROR:', err);
      res.status(500).json({ error: 'Failed to fetch room info' });
    }
  });
  

module.exports = router;
