const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  // username: { type: String, unique: true, required: true },
  // password: String,
  email: { 
    type: String, 
    unique: true, 
    required: true 
  }
  // resetPasswordToken: String,
  // resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);