import React, { useEffect, useRef } from 'react';

const DrawingCanvas = ({ socket, roomId, color, strokeWidth, drawingData, canvasRef }) => {
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const currentPath = useRef([]);


  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.background = '#ffffff';

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    // Render past drawing data
    if (drawingData && drawingData.length > 0) {
      drawingData.forEach((stroke) => {
        ctx.beginPath();
        stroke.path.forEach((point, index) => {
          index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.strokeWidth;
        ctx.stroke();
        ctx.closePath();
      });
    }
  }, [drawingData]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    socket.emit('draw-start', { roomId, color, strokeWidth, offsetX, offsetY });
    currentPath.current = [{ x: offsetX, y: offsetY }];

  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = strokeWidth;
    ctxRef.current.stroke();
    socket.emit('draw-move', { roomId, offsetX, offsetY });
    currentPath.current.push({ x: offsetX, y: offsetY });

  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    ctxRef.current.closePath();
    socket.emit('draw-end', { roomId });

    socket.emit('draw-end', {
        roomId,
        path: currentPath.current,
        color,
        strokeWidth,
      });
      currentPath.current = [];
      
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('draw-start', ({ offsetX, offsetY, color, strokeWidth }) => {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(offsetX, offsetY);
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = strokeWidth;
    });

    socket.on('draw-move', ({ offsetX, offsetY }) => {
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
    });

    socket.on('draw-end', () => ctxRef.current.closePath());

    socket.on('clear-canvas', () =>
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    );

    return () => {
      socket.off('draw-start');
      socket.off('draw-move');
      socket.off('draw-end');
      socket.off('clear-canvas');
    };
  }, [socket]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="absolute inset-0 z-10"
    />
  );
};

export default DrawingCanvas;
