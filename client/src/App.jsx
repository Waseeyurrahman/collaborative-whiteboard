import { Routes, Route, useNavigate } from 'react-router-dom';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';
import { useState } from 'react';
import './App.css';

function App() {
  const [roomId, setRoomId] = useState(null);
  const [drawingData, setDrawingData] = useState([]);
  const navigate = useNavigate();

  const handleJoinRoom = (roomId, data) => {
    setRoomId(roomId);
    setDrawingData(data);
    navigate(`/room/${roomId}`);
  };

  


  return (
    <Routes>
      <Route path="/" element={<RoomJoin onJoinRoom={handleJoinRoom} />} />
      <Route path="/room/:roomId" element={<Whiteboard drawingData={drawingData} />} />
    </Routes>
  );
}


export default App;
