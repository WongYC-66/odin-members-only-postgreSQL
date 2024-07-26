const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  isMember: { type: Boolean, required: true },
  isAdmin: { type: Boolean, default: false },
});


// Export model
module.exports = mongoose.model("User", UserSchema);