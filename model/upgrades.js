const mongoose = require('mongoose');

const ugradeSchema = new mongoose.Schema({
  public_key: String,
  email: String,
  name: String,
  tx_ref: { type: String, unique: true },
  currency: String,
  source: String,
  status: { type: String, enum: ['pending', 'success', 'failed'] },
  subscription:Number,
  response: mongoose.Schema.Types.Mixed,
  points: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  createdAt: { type: Date, default: Date.now },
  amount: { type: Number, required: true }
});

const Upgrade = mongoose.model('Ugrade', ugradeSchema);
module.exports = Upgrade;
