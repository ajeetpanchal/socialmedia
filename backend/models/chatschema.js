//this schema is used to store the information about chats.
//this schema is connected with userschema beacuse we need information about user beacuse we need to track which user is currently sending messages etc.
//this schema is connected with the messageschema because in the messageschema we store the information about our all conversation with perticular user.

const mongoose = require("mongoose");

const chatschema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Logins",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("CHAT", chatschema);
module.exports = Chat;
