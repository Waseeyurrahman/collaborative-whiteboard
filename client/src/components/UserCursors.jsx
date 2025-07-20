import React, { useEffect, useState } from 'react';

const UserCursors = ({ socket, cursorsRef, canvasRef }) => {
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    if (!socket) return;

    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      socket.emit('cursor-move', { x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    socket.on('update-cursors', (cursorData) => {
      setCursors(cursorData);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      socket.off('update-cursors');
    };
  }, [socket, canvasRef]);

  return (
    <>
      {Object.entries(cursors).map(([id, pos]) => (
       <div
       key={id}
       className="cursor-dot"
       style={{ left: pos.x, top: pos.y }}
     />
     
      ))}
    </>
  );
};

export default UserCursors;
