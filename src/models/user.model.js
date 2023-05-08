const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');

module.exports = (connection, autoIncrement) => {

  const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      min: 3,
      max: 25
    },
    email: {
      type: String,
      unique: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneNumber: {
      type: String,
      default: ""
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    
    roles: [
      {
        type: Number,
        ref: "Role"
      }
    ],
    transactions: [
      {
        type: Number,
        ref: "Transaction"
      }
    ],
    tokens: [
      {
        type: Number,
        ref: "Token"
      }
    ]
  })
  
  UserSchema.plugin(timestamps)
  UserSchema.plugin(autoIncrement.plugin, "User")
  
  const User = connection.model(
    "User",
    UserSchema  
  );

  return User;
}
