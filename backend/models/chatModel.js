const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  chatName: { type: String, trim: true },
  isGroupChat: { type: Boolean, default: false },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},
{timestamps: true},
);

// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin

module.exports = mongoose.model("Chat", ChatSchema);