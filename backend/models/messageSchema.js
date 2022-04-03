//message schema is for storing the one-to-one message sent by from which user to whome.
//this schema is connected with userschema beacuse we need information about user beacuse we need to track which user sent the message
//this schema is connected with the chatschema because in the chatschema we store the information about our chat
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Logins" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);
const Messages = mongoose.model("MESSAGE", messageSchema);
module.exports = Messages;
