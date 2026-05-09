const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
{
   amount:
   {
      type: Number,
      required: [true, 'Amount is required']
   },

   type:
   {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Type is required']
   },

   category:
   {
      type: String,
      required: [true, 'Category is required'],
      trim: true
   },

   date:
   {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
   },

   notes:
   {
      type: String,
      trim: true
   },

   createdBy:
   {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },

   isDeleted:
   {
      type: Boolean,
      default: false
   }
},
{
   timestamps: true
});

recordSchema.index({ createdBy: 1 });
recordSchema.index({ type: 1 });
recordSchema.index({ category: 1 });
recordSchema.index({ date: -1 });

module.exports = mongoose.model('Record', recordSchema);