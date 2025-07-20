const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  strokes: [
    {
      path: [{ x: Number, y: Number }],
      color: String,
      strokeWidth: Number,
    },
  ],
  timestamp: { type: Date, default: Date.now },
});



module.exports = mongoose.model('Drawing', drawingSchema);
