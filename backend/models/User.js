const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  resetPasswordOtpHash: {
    type: String,
  },

  resetPasswordOtpExpires: {
    type: Date,
  },

  resetPasswordOtpAttempts: {
    type: Number,
    default: 0,
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("User", userSchema);
