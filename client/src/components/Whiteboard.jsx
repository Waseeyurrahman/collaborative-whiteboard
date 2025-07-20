import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

const Whiteboard = ({ drawingData }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [userCount, setUserCount] = useState(1);

  const canvasRef = useRef(null);
  const cursorsRef = useRef({});

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    newSocket.emit('join-room', roomId);

    newSocket.on('user-count', (count) => setUserCount(count));

    return () => {
      newSocket.emit('leave-room', roomId);
      newSocket.disconnect();
    };
  }, [roomId]);

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('leave-room', roomId);
      socket.disconnect();
      navigate('/');
    }
  };

  return (
    <div className="whiteboard-container">
  <div className="user-count">👥 {userCount} user{userCount > 1 ? 's' : ''}</div>

  <button onClick={handleLeaveRoom} className="leave-button">
  Leave Room
</button>


  <Toolbar
    color={color}
    setColor={setColor}
    strokeWidth={strokeWidth}
    setStrokeWidth={setStrokeWidth}
    socket={socket}
    roomId={roomId}
  />

  <DrawingCanvas
    socket={socket}
    roomId={roomId}
    color={color}
    strokeWidth={strokeWidth}
    drawingData={drawingData}
    canvasRef={canvasRef}
  />

  <UserCursors socket={socket} cursorsRef={cursorsRef} canvasRef={canvasRef} />
</div>

  );
};

export default Whiteboard;
