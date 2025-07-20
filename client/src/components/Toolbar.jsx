import React, { useEffect, useRef } from 'react';

const Toolbar = ({ color, setColor, strokeWidth, setStrokeWidth, socket, roomId }) => {
  const rangeRef = useRef(null);

  const clearCanvas = () => {
    if (socket) {
      socket.emit('clear-canvas', roomId);
    }
  };

  useEffect(() => {
    const range = rangeRef.current;
    
    const updateSlider = () => {
      const percent = ((range.value - range.min) / (range.max - range.min)) * 100;
      range.style.background = `linear-gradient(to right, #007bff 0%, #007bff ${percent}%, #ccc ${percent}%, #ccc 100%)`;
    };

    updateSlider(); // Initialize on mount
    range.addEventListener('input', updateSlider);

    return () => {
      range.removeEventListener('input', updateSlider);
    };
  }, []);

  return (
    <div className="toolbar">
      <label>
        <span>Color:</span>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>

      <label>
        <span>Width:</span>
        <input
          ref={rangeRef}
          type="range"
          min="1"
          max="10"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
        />
      </label>

      <button className='clear-button' onClick={clearCanvas} >
        Clear
      </button>
    </div>
  );
};

export default Toolbar;
