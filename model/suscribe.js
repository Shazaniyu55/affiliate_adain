const mongoose = require('mongoose');

const subscribeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
amount: {
    type: Number,
    required: true
},

points: { type: Number, default: 0 },
subscription:Number,

status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
},

createdAt: {
    type: Date,
    default: Date.now
}


});

const Subscribe = mongoose.model('Subscribe', subscribeSchema);

module.exports = Subscribe;
