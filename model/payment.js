const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  amount: {
      type: Number,
      required: true
  },
  bankDetails: {
      accountNumber: String,
      accountName: String,
      bankName: String,
  },
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



// const paymentSchema = new mongoose.Schema({
//   //public_key: String,
//   email: String,
//   name: String,
//   tx_ref: String,
//   amount: Number,
//   currency: String,
//   source: String,
//   // status:String,
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
// },
//   response: mongoose.Schema.Types.Mixed,
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
//   createdAt: { type: Date, default: Date.now }
// });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
