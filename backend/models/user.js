const mongoose = require("mongoose")
const { Schema } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "password is required"]
  }
})

const User = mongoose.model("User", userSchema)

module.exports = User
