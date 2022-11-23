const mongoose = require("mongoose");
const validator = require("validator");

const schema = new mongoose.Schema(
  { name: "string", required: true, trim: true },
  { userName: "string", required: true, trim: true, unique: true },
  { userName: "string", required: true, trim: true, unique: true },
  {
    email: "string",
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  {
    password: "string",
    required: true,
    trim: true,
    minLength: 7,
  },
  { avatar: Buffer },
  { avatarExists: Boolean },
  { bio: "string" },
  { website: "string" },
  { location: "string" },
  { followers: Array, default: [] },
  { following: Array, default: [] },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", schema);

module.exports = User;
