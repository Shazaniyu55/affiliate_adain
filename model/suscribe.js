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

  //public_key: String,
  // email: String,
  // name: String,
  // tx_ref: { type: String, unique: true },
  // currency: String,
  // source: String,
  // status: { type: String, enum: ['pending', 'success', 'failed'] },
  // subscription:Number,
  // response: mongoose.Schema.Types.Mixed,
  // points: { type: Number, default: 0 },
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  // createdAt: { type: Date, default: Date.now },
  // amount: { type: Number, required: true }
});

const Subscribe = mongoose.model('Subscribe', subscribeSchema);

module.exports = Subscribe;
