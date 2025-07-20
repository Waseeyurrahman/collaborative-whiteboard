require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const RoomRoutes = require('./routes/roomRoutes');

const app = express();
const server = http.createServer(app);

//  Allow both localhost and Vercel frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.vercel.app' // 🔁 Replace with your actual deployed frontend URL
];

// CORS setup for Express
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use('/api/rooms', require('./routes/roomRoutes'));

//  Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error(' MongoDB error:', err));

//  Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const socketHandler = require('./socket/socketHandler');
socketHandler(io);

//  Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));
