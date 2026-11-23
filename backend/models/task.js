const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  completed: { type: Boolean, default: false, required: true }
}, { versionKey: false });

module.exports = mongoose.model('Task', taskSchema);
