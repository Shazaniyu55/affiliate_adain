// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, required: true },
    room: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    time: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
