import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const RoomJoin = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);

  const handleJoin = async () => {
    if (!roomId.trim()) {
      setError('Room ID is required');
      return;
    }

    if (!isAlphanumeric(roomId)) {
      setError('Only alphanumeric characters (A-Z, a-z, 0-9) allowed');
      return;
    }

    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/rooms/join`, { roomId });
      const { roomId: joinedRoomId, drawingData } = response.data;
      onJoinRoom(joinedRoomId, drawingData?.strokes || []);
    } catch (error) {
      console.error(error);
      setError('Failed to join or create the room');
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setRoomId(value);
      setError('');
    } else {
      setError('Only A-Z, a-z, 0-9 are allowed');
    }
  };

  return (
    <div className="centered-page">
    <div className="join-container">
      <h1 className="join-title">Join a Whiteboard</h1>
      <input
        type="text"
        placeholder="Enter Room ID"
        className="join-input"
        value={roomId}
        onChange={handleChange}
      />
      {error && <p className='error-message'>{error}</p>}
      <button onClick={handleJoin} className="join-button">
        Join
      </button>
    </div>
    </div>
  );
};

export default RoomJoin;
