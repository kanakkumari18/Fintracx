const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
   name:
   {
      type: String,
      required: [true, 'Name is required'],
      trim: true
   },

   email:
   {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address']
   },

   password:
   {
      type: String,
      required: [true, 'Password is required'],
      select: false
   },

   role:
   {
      type: String,
      enum: ['VIEWER', 'ANALYST', 'ADMIN'],
      default: 'VIEWER'
   },

   isActive:
   {
      type: Boolean,
      default: true
   },

   lastLogin:
   {
      type: Date
   }
},

{
   timestamps: true
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);